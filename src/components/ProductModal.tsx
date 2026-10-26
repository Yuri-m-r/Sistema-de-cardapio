import { useState } from "react";
import { createProduct, updateProduct } from "../api/productsApi";
import type {
  ProductModalProps,
  NewProduct,
  ProductFormValues,
} from "../types/productType";
import { validationProductSchema } from "../validation/productSchema";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { unitOptions } from "../constants/unitOptions";
import { productCategoryOption } from "../constants/productCategoryOption";
import { Modal } from "./Modal";

export const ProductModal = ({
  onClose,
  onSaved,
  product,
  mode,
}: ProductModalProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ------------- Initial values -------------
  const initialValues: ProductFormValues =
    mode === "create"
      ? { companyId: "1", name: "", unit: "", cost: "", category: "" }
      : {
          companyId: product.companyId,
          name: product.name,
          unit: product.unit,
          cost: product.cost,
          category: product.category,
        };

  // ------------- Handle submit -------------
  const handleSubmit = async (values: ProductFormValues) => {
    setSubmitError(null);

    const data: NewProduct = {
      ...values,
      name: values.name.trim(),
      unit: values.unit.trim(),
      cost: Number(values.cost),
    };

    try {
      if (mode === "create") {
        onSaved(await createProduct(data));
      } else {
        onSaved(await updateProduct({ ...data, id: product.id }));
      }
      onClose();
    } catch (error) {
      console.error(error);
      setSubmitError(
        mode === "create" ? "Erro ao cadastrar item" : "Erro ao atualizar item",
      );
    }
  };

  // ------------- Render -------------
  return (
    <Modal
      title={mode === "create" ? "Cadastrar produto" : "Editar produto"}
      onClose={onClose}
    >
      {submitError && (
        <p role="alert" className="alert alert--error">
          {submitError}
        </p>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationProductSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, dirty }) => (
          <Form className="form">
            <div className="field">
              <label htmlFor="name" className="label">
                Nome
              </label>
              <Field name="name" id="name" type="text" className="input" />
              <ErrorMessage name="name" component="p" className="field-error" />
            </div>

            <div className="field">
              <label htmlFor="unit" className="label">
                Unidade
              </label>
              <Field as="select" name="unit" id="unit" className="input">
                <option value="">Selecione uma unidade</option>
                {unitOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="unit" component="p" className="field-error" />
            </div>

            <div className="field">
              <label htmlFor="cost" className="label">
                Custo
              </label>
              <Field name="cost" id="cost" type="number" className="input" />
              <ErrorMessage name="cost" component="p" className="field-error" />
            </div>
             <div className="field">
              <label htmlFor="category" className="label">
                Categoria
              </label>
              <Field as="select" name="category" id="category" className="input">
                <option value="">Selecione uma categoria</option>
                {productCategoryOption.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="unit" component="p" className="field-error" />
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
    </Modal>
  );
};
