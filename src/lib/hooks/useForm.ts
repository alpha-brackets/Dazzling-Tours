"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { z } from "zod";
import {
  UseFormOptions,
  UseFormReturn,
} from "@/lib/types/form";

export function useForm<T extends object>({
  initialValues,
  validate,
  validateOnChange = false,
  validateOnBlur = true,
  onSubmit,
  onValidationError,
  persistKey,
}: UseFormOptions<T>): UseFormReturn<T> {
  // A persisted draft is read in the initialiser rather than restored by an
  // effect, so the first render already shows the draft — no second render, and
  // no window where the user sees empty fields that then fill in.
  // persistKey therefore only makes sense for client-rendered forms; on the
  // server there is no localStorage and initialValues are used.
  const [values, setValuesState] = useState<T>(() => {
    if (!persistKey || typeof window === "undefined") {
      return initialValues;
    }

    try {
      const saved = localStorage.getItem(persistKey);
      return saved ? { ...initialValues, ...JSON.parse(saved) } : initialValues;
    } catch (e) {
      console.error("Failed to load form draft:", e);
      return initialValues;
    }
  });
  const [errors, setErrorsState] = useState<Partial<Record<keyof T, string>>>(
    {},
  );
  const [touched, setTouchedState] = useState<
    Partial<Record<keyof T, boolean>>
  >({});
  const [dirty, setDirtyState] = useState<Partial<Record<keyof T, boolean>>>(
    {},
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialValuesRef = useRef(initialValues);
  const isInitialized = useRef(false);
  const valuesRef = useRef(values);
  const errorsRef = useRef(errors);
  const validateRef = useRef(validate);
  const onSubmitRef = useRef(onSubmit);
  const onValidationErrorRef = useRef(onValidationError);
  const validateOnChangeRef = useRef(validateOnChange);
  const validateOnBlurRef = useRef(validateOnBlur);

  // These mirrors exist so the callbacks below can read the latest values
  // without listing them as dependencies. They are written after the render
  // commits, not during it: mutating a ref while rendering makes render impure,
  // which breaks under concurrent rendering (a render can be started and thrown
  // away, leaving the ref describing a tree that was never shown).
  //
  // Writing them post-commit is safe here because every reader is an event
  // handler or an async submit path, and those only run after the commit.
  useEffect(() => {
    valuesRef.current = values;
    errorsRef.current = errors;
    validateRef.current = validate;
    onSubmitRef.current = onSubmit;
    onValidationErrorRef.current = onValidationError;
    validateOnChangeRef.current = validateOnChange;
    validateOnBlurRef.current = validateOnBlur;
  });

  // Persist the draft whenever values change. The first render is skipped so an
  // untouched form does not immediately overwrite a stored draft with its
  // initial values.
  useEffect(() => {
    if (!persistKey || typeof window === "undefined") {
      return;
    }

    if (!isInitialized.current) {
      isInitialized.current = true;
      return;
    }

    localStorage.setItem(persistKey, JSON.stringify(values));
  }, [values, persistKey]);

  // Calculate derived state
  const isValid = Object.keys(errors).length === 0;
  const isDirty = Object.keys(dirty).some((key) => dirty[key as keyof T]);

  // Validation function
  const validateForm = useCallback((currentValues: T = valuesRef.current) => {
    if (!validateRef.current) return true;

    const newErrors = validateRef.current(currentValues);
    setErrorsState(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  // Field validation function
  const validateField = useCallback(
    <K extends keyof T>(
      field: K,
      currentValues: T = valuesRef.current,
    ): boolean => {
      if (!validateRef.current) return true;

      const fieldErrors = validateRef.current(currentValues);
      const fieldError = fieldErrors[field];

      setErrorsState((prev) => {
        if (prev[field] === fieldError) return prev;
        const newErrors = { ...prev };
        if (fieldError) {
          newErrors[field] = fieldError;
        } else {
          delete newErrors[field];
        }
        return newErrors;
      });

      return !fieldError;
    },
    [],
  );

  // Set field value
  const setFieldValue = useCallback(
    <K extends keyof T>(
      field: K,
      value: T[K],
      options?: { shouldMarkDirty?: boolean },
    ) => {
      setValuesState((prev) => {
        const next = { ...prev, [field]: value };

        if (validateOnChangeRef.current) {
          // Trigger validation with NEXT values
          validateField(field, next);
        }

        return next;
      });

      if (options?.shouldMarkDirty !== false) {
        setDirtyState((prev) => ({
          ...prev,
          [field]: value !== initialValuesRef.current[field],
        }));
      }
    },
    [validateField],
  );

  // Set field error
  const setFieldError = useCallback(
    <K extends keyof T>(field: K, error: string | undefined) => {
      setErrorsState((prev) => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[field] = error;
        } else {
          delete newErrors[field];
        }
        return newErrors;
      });
    },
    [],
  );

  // Set field touched
  const setFieldTouched = useCallback(
    <K extends keyof T>(field: K, touched: boolean) => {
      setTouchedState((prev) => ({ ...prev, [field]: touched }));

      if (touched && validateOnBlurRef.current) {
        validateField(field);
      }
    },
    [validateField],
  );

  // Set multiple values
  const setValues = useCallback(
    (
      newValues: Partial<T>,
      options?: {
        shouldMarkDirty?: boolean;
        shouldReinitialize?: boolean;
        baselineSyncOnly?: boolean;
      },
    ) => {
      if (!options?.baselineSyncOnly) {
        setValuesState((prev) => ({ ...prev, ...newValues }));
      }

      if (options?.shouldReinitialize || options?.baselineSyncOnly) {
        initialValuesRef.current = {
          ...initialValuesRef.current,
          ...newValues,
        } as T;
        // Reset dirty state for fields that were just synced
        setDirtyState((prev) => {
          const newDirty = { ...prev };
          Object.keys(newValues).forEach((key) => {
            delete newDirty[key as keyof T];
          });
          return newDirty;
        });
        return;
      }

      if (options?.shouldMarkDirty !== false) {
        setDirtyState((prev) => {
          const newDirty = { ...prev };
          Object.keys(newValues).forEach((key) => {
            const field = key as keyof T;
            newDirty[field] =
              newValues[field] !== initialValuesRef.current[field];
          });
          return newDirty;
        });
      }
    },
    [],
  );

  // Set multiple errors
  const setErrors = useCallback(
    (newErrors: Partial<Record<keyof T, string>>) => {
      setErrorsState(newErrors);
    },
    [],
  );

  // Set multiple touched
  const setTouched = useCallback(
    (newTouched: Partial<Record<keyof T, boolean>>) => {
      setTouchedState(newTouched);
    },
    [],
  );

  // Set dirty state manually
  const setDirty = useCallback(
    (isDirty: boolean) => {
      if (!isDirty) {
        setDirtyState({});
      } else {
        // Mark all as dirty if needed, but usually we just want to clear it
        const allDirty = Object.keys(values).reduce(
          (acc, key) => {
            acc[key as keyof T] = true;
            return acc;
          },
          {} as Partial<Record<keyof T, boolean>>,
        );
        setDirtyState(allDirty);
      }
    },
    [values],
  );

  // Reset form
  const reset = useCallback(() => {
    setValuesState(initialValuesRef.current);
    setErrorsState({});
    setTouchedState({});
    setDirtyState({});
    setIsSubmitting(false);
  }, []);

  // Clear localStorage draft
  const clearDraft = useCallback(() => {
    if (persistKey && typeof window !== "undefined") {
      localStorage.removeItem(persistKey);
    }
  }, [persistKey]);

  // Handle form submission
  const handleSubmit = useCallback(
    (customOnSubmit?: (values: T) => void | Promise<void>) => {
      return async (e: React.FormEvent) => {
        e.preventDefault();

        const currentValues = valuesRef.current;

        // Mark all fields as touched
        const allTouched = Object.keys(currentValues).reduce(
          (acc, key) => {
            acc[key as keyof T] = true;
            return acc;
          },
          {} as Partial<Record<keyof T, boolean>>,
        );
        setTouchedState(allTouched);

        // Validate form
        const isValid = validateForm(currentValues);

        // Get the latest errors after validation
        const latestErrors = validateRef.current
          ? validateRef.current(currentValues)
          : {};

        if (!isValid) {
          // Call onValidationError callback if provided
          if (onValidationErrorRef.current) {
            onValidationErrorRef.current(latestErrors);
          }

          // Scroll to first error field if possible
          const firstErrorField = Object.keys(latestErrors)[0];
          if (firstErrorField) {
            // Try to find the input field by name or id
            const errorElement = document.querySelector(
              `[name="${firstErrorField}"], [id="${firstErrorField}"]`,
            ) as HTMLElement;
            if (errorElement) {
              errorElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
              errorElement.focus();
            }
          }
          return;
        }

        setIsSubmitting(true);

        try {
          const submitHandler = customOnSubmit || onSubmitRef.current;
          if (submitHandler) {
            await submitHandler(currentValues);
          }
        } catch {
        } finally {
          setIsSubmitting(false);
        }
      };
    },
    [validateForm],
  );

  // Get field props for form components
  const getFieldProps = useCallback(
    <K extends keyof T>(field: K) => {
      return {
        value: values[field],
        error: errors[field],
        onChange: (value: T[K]) => setFieldValue(field, value),
        onBlur: () => setFieldTouched(field, true),
        onFocus: () => setFieldTouched(field, false),
      };
    },
    [values, errors, setFieldValue, setFieldTouched],
  );

  return {
    values,
    errors,
    touched,
    dirty,
    isValid,
    isSubmitting,
    isDirty,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    setValues,
    setErrors,
    setTouched,
    setDirty,
    reset,
    clearDraft,
    validate: validateForm,
    validateField,
    handleSubmit,
    getFieldProps,
  };
}

// Zod integration helper
export function createZodForm<T extends z.ZodType>(schema: T) {
  return {
    validate: (values: z.infer<T>) => {
      const result = schema.safeParse(values);
      if (result.success) {
        return {};
      }

      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        errors[path] = issue.message;
      });

      return errors;
    },
  };
}
