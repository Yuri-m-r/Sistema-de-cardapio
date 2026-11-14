// ------------- Import react -------------
import { useState } from "react";
// ------------- Import types -------------
import type {
  ProductModalProps,
  NewProduct,
  ProductFormValues,
} from "../types/productType";
// ------------- Import components/hooks/utils -------------
import { Modal } from "./Modal";
// ------------- Import formik -------------
import { validationProductSchema } from "../validation/productsSchema";
import { Formik, Form, Field, ErrorMessage } from "formik";
// ------------- Import constants -------------
import { unitOptions } from "../constants/unitOptions";
import { productCategoryOptions } from "../constants/productCategoryOptions";
// ------------- Import api -------------
import { createProduct, updateProduct } from "../api/productApi";

export const ProductModal = ({
  onClose,
  onSaved,
  product,
  mode,
}: ProductModalProps) => {
  // ------------- State -------------
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
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
    if (!values.unit) {
      setSubmitError("Selecione uma unidade válida");
      return;
    } else if (!values.category) {
      setSubmitError("Selecione uma categoria válida");
      return;
    }

    setIsBusy(true);
    setSubmitError(null);

    const data: NewProduct = {
      ...values,
      name: values.name.trim(),
      unit: values.unit,
      category: values.category,
      cost: Number(values.cost),
    };
    // ------------- Create product -------------
    try {
      if (mode === "create") {
        onSaved(await createProduct(data));
        // ------------- Update product -------------
      } else {
        onSaved(await updateProduct({ ...data, id: product.id }));
      }
      onClose();
    } catch (error) {
      console.error(error);
      setSubmitError(
        mode === "create"
          ? "Erro ao cadastrar produto"
          : "Erro ao atualizar produto",
      );
    } finally {
      setIsBusy(false);
    }
  };

  // ------------- Render -------------
  return (
    <Modal
      title={mode === "create" ? "Cadastrar produto" : "Editar produto"}
      onClose={onClose}
      isBusy={isBusy}
    >
      {/* ------------- Show status messages ------------- */}
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
            {/* ------------- Fields ------------- */}
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
              <Field
                name="cost"
                id="cost"
                type="number"
                className="input"
                step="0.01"
              />
              <ErrorMessage name="cost" component="p" className="field-error" />
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
                {productCategoryOptions.map((option) => (
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
    </Modal>
  );
};
