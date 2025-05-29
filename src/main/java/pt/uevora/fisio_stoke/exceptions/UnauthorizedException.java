package pt.uevora.fisio_stoke.exceptions;

public class UnauthorizedException extends BusinessException {
    public UnauthorizedException(String message) {
        super(message, "UNAUTHORIZED");
    }

    public UnauthorizedException() {
        super("Acesso não autorizado", "UNAUTHORIZED");
    }
} 