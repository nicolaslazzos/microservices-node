import { useState } from "react";
import axios from "axios";

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState({});

  const doRequest = async (data = {}) => {
    setErrors({});

    try {
      const response = await axios[method](url, { ...body, ...data });

      onSuccess?.(response.data);

      return response.data;
    } catch (e) {
      const newErrors = { errors: [], all: [] };

      e?.response?.data?.errors?.forEach((error) => {
        error?.field ? (newErrors[error.field] = { content: error.message }) : newErrors.errors.push(error.message);

        newErrors.all.push(error.message);
      });

      setErrors(newErrors);
    }
  };

  return [errors, doRequest];
};

export default useRequest;
