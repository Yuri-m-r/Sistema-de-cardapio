import { useState } from "react";
import type {
  TechDataSheetModalProps,
  TechDataSheetFormValues,
  NewTechDataSheet,
  EditedTechDataSheet,
} from "../types/techDataSheetsType";

import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { validationDataSheetSchema } from "../validation/techDataSheetsSchema";
import { unitOptions } from "../constants/unitOptions";
import { techDataSheetcategoryOptions } from "../constants/techDataSheetcategoryOptions";
import {
  createCompleteTechDataSheet,
  updateDataSheet,
  updateDataSheetItems,
} from "../api/techDataSheetApi";

import { useTechDataSheets } from "../hooks/useTechDataSheet";
import { Modal } from "./Modal";

export const TechDataSheetsModal = ({
  mode,
  onClose,
  onSaved,
  dataSheet,
  allProducts,
}: TechDataSheetModalProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ------------- Load data sheet items(custom hook) -------------
  const response = useTechDataSheets(dataSheet?.id);

  // ------------- Initial values -------------
  const initialValues: TechDataSheetFormValues =
    mode === "create"
      ? {
          companyId: "1",
          name: "",
          yield: "",
          yieldUnity: "",
          obs: "",
          prepTime: "",
          category: "",
          products: [{ productId: "", quantity: "" }],
        }
      : {
          companyId: dataSheet.companyId,
          name: dataSheet.name,
          yield: dataSheet.yield,
          yieldUnity: dataSheet.yieldUnity,
          obs: dataSheet.obs,
          prepTime: dataSheet.prepTime,
          category: dataSheet.category,

          products:
            response.status === "success"
              ? response.data.map((item) => ({
                  id: item.id,
                  productId: item.productId,
                  quantity: item.quantity,
                }))
              : [],
        };

  // ------------- Handle submit -------------
  const handleSubmit = async (values: TechDataSheetFormValues) => {
    setSubmitError(null);

    const { products, ...fields } = values;

    const data = {
      ...fields,
      name: fields.name.trim(),
      obs: fields.obs.trim(),
      yield: Number(fields.yield),
      prepTime: Number(fields.prepTime),
    };

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
      } else {
        if (response.status !== "success") return;

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
    }
  };

  // ------------- Render -------------
  return (
    <Modal
      title={
        mode === "create" ? "Cadastrar ficha técnica" : "Editar ficha técnica"
      }
      onClose={onClose}
      size="lg"
    >
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
            {({ values, isSubmitting, dirty, errors }) => (
              <Form className="form">
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
                    />
                    <ErrorMessage
                      name="yield"
                      component="p"
                      className="field-error"
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="yieldUnity" className="label">
                      Unidade de rendimento
                    </label>
                    <Field
                      as="select"
                      name="yieldUnity"
                      id="yieldUnity"
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
                      name="yieldUnity"
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
                      {techDataSheetcategoryOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="yieldUnity"
                      component="p"
                      className="field-error"
                    />
                  </div>
                </div>

                <FieldArray name="products">
                  {({ push, remove }) => (
                    <section className="section">
                      <div className="section__header">
                        <h3 className="section__title">Insumos</h3>
                        <button
                          type="button"
                          className="btn btn--ghost btn--sm"
                          onClick={() =>
                            push({
                              productId: "",
                              quantity: "",
                            })
                          }
                        >
                          + Adicionar insumo
                        </button>
                      </div>

                      <ul className="items-list">
                        {values.products.map((item, index) => {
                          const selectedProduct = allProducts.find(
                            (product) => product.id === item.productId,
                          );

                          return (
                            <li key={index} className="item-row">
                              <div className="field">
                                <label
                                  htmlFor={`products.${index}.productId`}
                                  className="label"
                                >
                                  Insumo
                                </label>
                                <Field
                                  as="select"
                                  name={`products.${index}.productId`}
                                  id={`products.${index}.productId`}
                                  className="input"
                                >
                                  <option value="">Selecione um insumo</option>

                                  {allProducts.map((product) => (
                                    <option key={product.id} value={product.id}>
                                      {product.name} {product.unit}
                                    </option>
                                  ))}
                                </Field>
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

                <div className="modal__footer">
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => onClose()}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={
                      isSubmitting || !dirty || response.status === "error"
                    }
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
