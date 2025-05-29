package pt.uevora.fisio_stoke.exceptions;

public class ValidationException extends BusinessException {
    public ValidationException(String message) {
        super(message, "VALIDATION_ERROR");
    }

    public ValidationException(String field, String message) {
        super(String.format("Erro de validação no campo '%s': %s", field, message),
              "VALIDATION_ERROR");
    }
} 