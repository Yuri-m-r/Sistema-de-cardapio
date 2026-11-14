// ------------- Import react -------------
import { useMemo, useState } from "react";
// ------------- Import types -------------
import type {
  TechDataSheetModalProps,
  TechDataSheetFormValues,
  NewTechDataSheet,
  EditedTechDataSheet,
} from "../types/techDataSheetType";
// ------------- Import formik -------------
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { validationDataSheetSchema } from "../validation/techDataSheetsSchema";
// ------------- Import constants -------------
import { unitOptions } from "../constants/unitOptions";
import { techDataSheetCategoryOptions } from "../constants/techDataSheetCategoryOptions";
// ------------- Import api -------------
import {
  createCompleteTechDataSheet,
  updateDataSheet,
  updateDataSheetItems,
} from "../api/techDataSheetApi";
// ------------- Import components/hooks/utils -------------
import { useTechDataSheetItem } from "../hooks/useTechDataSheetItem";
import { Modal } from "./Modal";
import { Combobox } from "./Combobox";

export const TechDataSheetModal = ({
  mode,
  onClose,
  onSaved,
  dataSheet,
  allProducts,
}: TechDataSheetModalProps) => {
  //------------- State -------------
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  // ------------- Load data sheet items -------------
  const { response } = useTechDataSheetItem(dataSheet?.id);

  // ------------- Initial values -------------
  const initialValues = useMemo<TechDataSheetFormValues>(() => {
    return mode === "create"
      ? {
          companyId: "1",
          name: "",
          yield: "",
          yieldUnit: "",
          obs: "",
          prepTime: "",
          category: "",
          products: [
            {
              id: undefined,
              productId: "",
              quantity: "",
              rowKey: crypto.randomUUID(),
            },
          ],
        }
      : {
          companyId: dataSheet.companyId,
          name: dataSheet.name,
          yield: dataSheet.yield,
          yieldUnit: dataSheet.yieldUnit,
          obs: dataSheet.obs,
          prepTime: dataSheet.prepTime,
          category: dataSheet.category,

          products:
            response.status === "success"
              ? response.data.map((item) => ({
                  id: item.id,
                  productId: item.productId,
                  quantity: item.quantity,
                  rowKey: crypto.randomUUID(),
                }))
              : [],
        };
  }, [response, dataSheet, mode]);

  // ------------- Handle submit -------------
  const handleSubmit = async (values: TechDataSheetFormValues) => {
    if (!values.yieldUnit) {
      setSubmitError("Selecione uma unidade válida");
      return;
    } else if (!values.category) {
      setSubmitError("Selecione uma categoria válida");
      return;
    }

    setSubmitError(null);
    setIsBusy(true);

    const { products, ...fields } = values;

    const data = {
      ...fields,
      name: fields.name.trim(),
      obs: fields.obs.trim(),
      yield: Number(fields.yield),
      prepTime: Number(fields.prepTime),
      category: values.category,
      yieldUnit: values.yieldUnit,
    };
    // ------------- Create tech data sheet -------------
    try {
      if (mode === "create") {
        const now = new Date().toISOString();
        const newDataSheet: NewTechDataSheet = {
          ...data,
          creationDate: now,
          lastRevision: now,
          products: products.map((item) => ({
            productId: item.productId,
            quantity: Number(item.quantity),
          })),
        };

        const createdDataSheet =
          await createCompleteTechDataSheet(newDataSheet);
        onSaved(createdDataSheet);
      }
      // ------------- Update tech data sheet -------------
      else {
        if (response.status !== "success") {
          setSubmitError("Não foi possível salvar a ficha técnica");
          setIsBusy(false);
          return;
        }

        const editedDataSheet: EditedTechDataSheet = {
          ...data,
          id: dataSheet.id,
          creationDate: dataSheet.creationDate,
          lastRevision: new Date().toISOString(),

          products: products.map((item) => ({
            id: item.id,
            productId: item.productId,
            quantity: Number(item.quantity),
          })),
        };

        const updated = await updateDataSheet(editedDataSheet);
        await updateDataSheetItems(editedDataSheet, response.data);
        onSaved(updated);
      }

      onClose();
    } catch (error) {
      console.error(error);

      setSubmitError(
        mode === "create"
          ? "Não foi possível criar a ficha técnica"
          : "Não foi possível salvar a ficha técnica",
      );
    } finally {
      setIsBusy(false);
    }
  };

  // ------------- Render -------------
  return (
    <Modal
      title={
        mode === "create" ? "Cadastrar ficha técnica" : "Editar ficha técnica"
      }
      isBusy={isBusy}
      onClose={onClose}
      size="lg"
    >
      {/* ------------- Show status messages ------------- */}

      {mode === "edit" && response.status === "loading" ? (
        <p role="status" className="status-text">
          Carregando itens da ficha técnica...
        </p>
      ) : mode === "edit" && response.status === "error" ? (
        <p role="alert" className="alert alert--error">
          {response.error}
        </p>
      ) : (
        <>
          {submitError && (
            <p role="alert" className="alert alert--error">
              {submitError}
            </p>
          )}
          <Formik
            initialValues={initialValues}
            validationSchema={validationDataSheetSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              isSubmitting,
              dirty,
              errors,
              setFieldTouched,
              setFieldValue,
            }) => (
              <Form className="form">
                {/* ------------- Fields ------------- */}
                <div className="form-grid">
                  <div className="field form-grid__full">
                    <label htmlFor="name" className="label">
                      Nome
                    </label>
                    <Field
                      name="name"
                      id="name"
                      type="text"
                      className="input"
                    />
                    <ErrorMessage
                      name="name"
                      component="p"
                      className="field-error"
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="yield" className="label">
                      Rendimento
                    </label>
                    <Field
                      name="yield"
                      id="yield"
                      type="number"
                      className="input"
                      step="0.01"
                    />
                    <ErrorMessage
                      name="yield"
                      component="p"
                      className="field-error"
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="yieldUnit" className="label">
                      Unidade de rendimento
                    </label>
                    <Field
                      as="select"
                      name="yieldUnit"
                      id="yieldUnit"
                      className="input"
                    >
                      <option value="">Selecione uma unidade</option>
                      {unitOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="yieldUnit"
                      component="p"
                      className="field-error"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="prepTime" className="label">
                      Tempo de preparo em minutos
                    </label>
                    <Field
                      name="prepTime"
                      id="prepTime"
                      type="number"
                      className="input"
                    />
                    <ErrorMessage
                      name="prepTime"
                      component="p"
                      className="field-error"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="category" className="label">
                      Categoria
                    </label>
                    <Field
                      as="select"
                      name="category"
                      id="category"
                      className="input"
                    >
                      <option value="">Selecione uma categoria</option>
                      {techDataSheetCategoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Field>

                    <ErrorMessage
                      name="category"
                      component="p"
                      className="field-error"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="section__title">Insumos</h3>
                </div>
                {/* ------------- Field array / combobox ------------- */}
                <FieldArray name="products">
                  {({ push, remove }) => (
                    <section className="section">
                      <ul className="items-list">
                        {values.products.map((item, index) => {
                          const selectedProduct = allProducts.find(
                            (product) => product.id === item.productId,
                          );

                          const usedIds = values.products.map(
                            (row) => row.productId,
                          );

                          const availableProducts = allProducts.filter(
                            (product) =>
                              product.id === item.productId ||
                              !usedIds.includes(product.id),
                          );

                          return (
                            <li key={item.rowKey} className="item-row">
                              <div className="field">
                                <label
                                  htmlFor={`products.${index}.productId`}
                                  className="label"
                                >
                                  Insumo
                                </label>

                                <Combobox
                                  id={`products.${index}.productId`}
                                  options={availableProducts}
                                  value={item.productId}
                                  onChange={(productId) =>
                                    setFieldValue(
                                      `products.${index}.productId`,
                                      productId,
                                    )
                                  }
                                  onBlur={() =>
                                    setFieldTouched(
                                      `products.${index}.productId`,
                                      true,
                                    )
                                  }
                                  getMeta={(p) =>
                                    [p.category, p.unit]
                                      .filter(Boolean)
                                      .join(" · ")
                                  }
                                  placeholder="Pesquisar insumo"
                                  emptyMessage="Nenhum insumo encontrado"
                                />
                                <ErrorMessage
                                  name={`products.${index}.productId`}
                                  component="p"
                                  className="field-error"
                                />
                              </div>

                              <div className="field">
                                <label
                                  htmlFor={`products.${index}.quantity`}
                                  className="label"
                                >
                                  Quantidade
                                  {selectedProduct
                                    ? ` (${selectedProduct.unit})`
                                    : ""}
                                </label>
                                <Field
                                  type="number"
                                  name={`products.${index}.quantity`}
                                  id={`products.${index}.quantity`}
                                  className="input"
                                  step="0.01"
                                />
                                <ErrorMessage
                                  name={`products.${index}.quantity`}
                                  component="p"
                                  className="field-error"
                                />
                              </div>

                              <button
                                type="button"
                                className="btn btn--danger btn--sm item-row__remove"
                                disabled={isSubmitting}
                                aria-label={`Remover insumo ${index + 1}`}
                                onClick={() => remove(index)}
                              >
                                Remover
                              </button>
                            </li>
                          );
                        })}
                      </ul>

                      {typeof errors.products === "string" && (
                        <p role="alert" className="field-error">
                          {errors.products}
                        </p>
                      )}

                      <div className="section__header">
                        <button
                          type="button"
                          className="btn btn--ghost btn--sm"
                          disabled={isSubmitting}
                          onClick={() =>
                            push({
                              id: undefined,
                              productId: "",
                              quantity: "",
                              rowKey: crypto.randomUUID(),
                            })
                          }
                        >
                          + Adicionar insumo
                        </button>
                      </div>
                    </section>
                  )}
                </FieldArray>

                <div className="field">
                  <label htmlFor="obs" className="label">
                    Modo de preparo
                  </label>
                  <Field
                    name="obs"
                    id="obs"
                    as="textarea"
                    className="input textarea"
                  />
                  <ErrorMessage
                    name="obs"
                    component="p"
                    className="field-error"
                  />
                </div>
                {/* ------------- Footer buttons ------------- */}
                <div className="modal__footer">
                  <button
                    type="button"
                    className="btn btn--secondary"
                    disabled={isBusy}
                    onClick={() => onClose()}
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
        </>
      )}
    </Modal>
  );
};
