import { useState } from "react";
import axios from "axios";

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState({});

  const doRequest = async () => {
    setErrors({});

    try {
      const response = await axios[method](url, body);

      onSuccess?.(response.data);

      return response.data;
    } catch (e) {
      const newErrors = {};

      e.response.data.errors.forEach(
        (error) => (newErrors[error.field] = { content: error.message })
      );

      setErrors(newErrors);
    }
  };

  return [errors, doRequest];
};

export default useRequest;
