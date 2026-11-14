// ------------- Import react -------------
import { useMemo, useState } from "react";
// ------------- Import types -------------
import type {
  EditedMenu,
  MenuFormValues,
  MenuModalProps,
  NewMenu,
} from "../types/menuType";
// ------------- Import components/hooks/utils -------------
import { Modal } from "./Modal";
import { Combobox } from "./Combobox";
import { useMenuItemsWithDataSheet } from "../hooks/useMenuItemsWithDataSheet";
import { formatNumber } from "../utils/formatNumber";
// ------------- Import formik -------------
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { validationMenuSchema } from "../validation/menusSchema";
//------------- Import constants -------------
import { weekDayOptions } from "../constants/weekDayOptions";
// ------------- Import api -------------
import {
  createCompleteMenu,
  updateMenu,
  updateMenuItems,
} from "../api/menuApi";

export const MenuModal = ({ mode, onClose, onSaved, menu }: MenuModalProps) => {
  // ------------- State -------------
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ------------- Get tech data sheet with items -------------

  const { response, techDataSheets, menuItems } = useMenuItemsWithDataSheet(
    menu?.id,
  );
  const [isBusy, setIsBusy] = useState(false);

  // ------------- Initial values -------------

  const initialValues = useMemo<MenuFormValues>(() => {
    return mode === "create"
      ? {
          companyId: "1",
          name: "",
          weekDay: "",
          techDataSheetsForm: [
            {
              techDataSheetsId: "",
              id: undefined,
              portionsPredicted: "",
              rowKey: crypto.randomUUID(),
            },
          ],
        }
      : {
          companyId: menu.companyId,
          name: menu.name,
          weekDay: menu.weekDay,
          techDataSheetsForm:
            response.status === "success"
              ? response.data.map((m) => ({
                  techDataSheetsId: m.techDataSheetsId,
                  id: m.id,
                  portionsPredicted: m.portionsPredicted,
                  rowKey: crypto.randomUUID(),
                }))
              : [],
        };
  }, [response, mode, menu]);

  // ------------- Handle submit -------------
  const handleSubmit = async (values: MenuFormValues) => {
    if (!values.weekDay) {
      setSubmitError("Selecione um dia da semana válido");
      return;
    }
    setSubmitError(null);
    setIsBusy(true);
    const { techDataSheetsForm, ...fields } = values;
    const data = {
      ...fields,
      name: fields.name.trim(),
      weekDay: values.weekDay,
    };
    // ------------- Create menu -------------
    try {
      if (mode === "create") {
        const newMenu: NewMenu = {
          ...data,
          menuItems: techDataSheetsForm.map((item) => ({
            techDataSheetsId: item.techDataSheetsId,
            portionsPredicted: Number(item.portionsPredicted),
          })),
        };
        const createdMenu = await createCompleteMenu(newMenu);
        onSaved(createdMenu);
      }
      // ------------- Update menu -------------
      else {
        const editedMenu: EditedMenu = {
          ...data,
          id: menu.id,
          menuItems: techDataSheetsForm.map((item) => ({
            id: item.id,
            menuId: menu.id,
            techDataSheetsId: item.techDataSheetsId,
            portionsPredicted: Number(item.portionsPredicted),
          })),
        };
        if (menuItems.status !== "success") {
          setSubmitError("Não foi possível salvar o cardápio");
          setIsBusy(false);
          return;
        }
        const updatedMenu = await updateMenu(editedMenu);
        await updateMenuItems(editedMenu.menuItems, menuItems.data);
        onSaved(updatedMenu);
      }
      onClose();
    } catch (error) {
      console.error(error);
      setSubmitError(
        mode === "create"
          ? "Não foi possível criar o cardápio"
          : "Não foi possível salvar o cardápio",
      );
    } finally {
      setIsBusy(false);
    }
  };

  // ------------- Render -------------

  return (
    <Modal
      title={mode === "create" ? "Cadastrar cardápio" : "Editar cardápio"}
      onClose={onClose}
      size="lg"
      isBusy={isBusy}
    >
      {/* ------------- Show status messages ------------- */}
      {submitError && (
        <p role="alert" className="alert alert--error">
          {submitError}
        </p>
      )}
      {response.status === "loading" ? (
        <p role="status" className="status-text">
          Carregando preparos do cardápio...
        </p>
      ) : response.status === "error" ? (
        <p role="alert" className="alert alert--error">
          {response.error}
        </p>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationMenuSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            isSubmitting,
            dirty,
            errors,
            setFieldValue,
            setFieldTouched,
          }) => (
            <Form className="form">
              {/* ------------- Fields ------------- */}
              <div className="form-grid">
                <div className="field form-grid__full">
                  <label htmlFor="name" className="label">
                    Nome
                  </label>
                  <Field name="name" id="name" type="text" className="input" />
                  <ErrorMessage
                    name="name"
                    component="p"
                    className="field-error"
                  />
                </div>

                <div className="field form-grid__full">
                  <label htmlFor="weekDay" className="label">
                    Dia da semana
                  </label>
                  <Field
                    as="select"
                    name="weekDay"
                    id="weekDay"
                    className="input"
                  >
                    <option value="">Selecione um dia</option>
                    {weekDayOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="weekDay"
                    component="p"
                    className="field-error"
                  />
                </div>
              </div>
              <div>
                <h3 className="section__title">Preparos</h3>
              </div>
              {/* ------------- Field array / combobox ------------- */}
              <FieldArray name="techDataSheetsForm">
                {({ push, remove }) => (
                  <section className="section">
                    {techDataSheets.status === "success" && (
                      <ul className="items-list">
                        {values.techDataSheetsForm.map((item, index) => {
                          const selectedDataSheet = techDataSheets.data.find(
                            (dataSheet) =>
                              dataSheet.id === item.techDataSheetsId,
                          );

                          const usedIds = values.techDataSheetsForm.map(
                            (row) => row.techDataSheetsId,
                          );

                          const availableDataSheet = techDataSheets.data.filter(
                            (dataSheet) =>
                              dataSheet.id === item.techDataSheetsId ||
                              !usedIds.includes(dataSheet.id),
                          );

                          return (
                            <li key={item.rowKey} className="item-row">
                              <div className="field">
                                <label
                                  htmlFor={`techDataSheetsForm.${index}.techDataSheetsId`}
                                  className="label"
                                >
                                  Preparo
                                  {selectedDataSheet
                                    ? `  - (Rendimento: ${formatNumber(selectedDataSheet.yield)} ${selectedDataSheet.yieldUnit})`
                                    : ""}
                                </label>

                                <Combobox
                                  id={`techDataSheetsForm.${index}.techDataSheetsId`}
                                  options={availableDataSheet}
                                  value={item.techDataSheetsId}
                                  onChange={(techDataSheetsId) =>
                                    setFieldValue(
                                      `techDataSheetsForm.${index}.techDataSheetsId`,
                                      techDataSheetsId,
                                    )
                                  }
                                  onBlur={() =>
                                    setFieldTouched(
                                      `techDataSheetsForm.${index}.techDataSheetsId`,
                                      true,
                                    )
                                  }
                                  getMeta={(s) =>
                                    [
                                      s.category,
                                      formatNumber(s.yield),
                                      s.yieldUnit,
                                    ]
                                      .filter(Boolean)
                                      .join(" · ")
                                  }
                                  placeholder="Pesquisar preparo"
                                  emptyMessage="Nenhum preparo encontrado"
                                />
                                <ErrorMessage
                                  name={`techDataSheetsForm.${index}.techDataSheetsId`}
                                  component="p"
                                  className="field-error"
                                />
                              </div>

                              <div className="field">
                                <label
                                  htmlFor={`techDataSheetsForm.${index}.portionsPredicted`}
                                  className="label"
                                >
                                  Receitas previstas
                                </label>
                                <Field
                                  type="number"
                                  name={`techDataSheetsForm.${index}.portionsPredicted`}
                                  id={`techDataSheetsForm.${index}.portionsPredicted`}
                                  className="input"
                                />
                                <ErrorMessage
                                  name={`techDataSheetsForm.${index}.portionsPredicted`}
                                  component="p"
                                  className="field-error"
                                />
                              </div>

                              <button
                                type="button"
                                className="btn btn--danger btn--sm item-row__remove"
                                disabled={isSubmitting}
                                aria-label={`Remover preparo ${index + 1}`}
                                onClick={() => remove(index)}
                              >
                                Remover
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}

                    {typeof errors.techDataSheetsForm === "string" && (
                      <p role="alert" className="field-error">
                        {errors.techDataSheetsForm}
                      </p>
                    )}
                    <div className="section__header">
                      <button
                        type="button"
                        className="btn btn--ghost btn--sm"
                        disabled={isSubmitting}
                        onClick={() =>
                          push({
                            techDataSheetsId: "",
                            id: undefined,
                            portionsPredicted: "",
                            rowKey: crypto.randomUUID(),
                          })
                        }
                      >
                        + Adicionar preparo
                      </button>
                    </div>
                  </section>
                )}
              </FieldArray>
              {/* ------------- Footer buttons ------------- */}
              <div className="modal__footer">
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => onClose()}
                  disabled={isBusy}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={isSubmitting || !dirty}
                >
                  {isSubmitting
                    ? "Salvando..."
                    : mode === "create"
                      ? "Cadastrar"
                      : "Salvar"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </Modal>
  );
};
