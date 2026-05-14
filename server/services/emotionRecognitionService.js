import axios from "axios";
import FormData from "form-data";

export async function predict(file) {
  const form = new FormData();
  form.append("file", file.buffer, {
    filename: file.originalname,
    contentType: file.mimetype,
  });

  try {
    const response = await axios.post("http://python-api:8000/predict", form, {
      headers: form.getHeaders(),
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      const message = error.response.data.detail || "Błąd serwera";
      const customError = new Error(message);
      customError.status = error.response.status;
      throw customError;
    } 
    
    if (error.request) {
      throw new Error("Brak odpowiedzi od serwera. Sprawdź czy kontener python-api działa.");
    }

    throw new Error("Wystąpił błąd podczas przygotowywania żądania.");
  }
}
