from rest_framework.views import exception_handler
from rest_framework.exceptions import ValidationError, AuthenticationFailed, NotAuthenticated, PermissionDenied
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.exceptions import TokenError
import traceback
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    # Обработка ошибок JWT-токенов
    if isinstance(exc, InvalidToken):
        try:
            error_data = exc.detail  # dict с code, detail и messages

            # Проверка: если причина — истёкший токен
            if error_data.get("code") == "token_not_valid":
                # Первый случай — messages внутри (чаще при access)
                for msg in error_data.get("messages", []):
                    if msg.get("message") == "Token is expired":
                        return Response({
                            "code": "token_expired",
                            "detail": "Given token not valid for any token type"
                        }, status=status.HTTP_401_UNAUTHORIZED)

                # Второй случай — просто detail содержит "Token is expired"
                if "Token is expired" in error_data.get("detail", ""):
                    return Response({
                        "code": "token_expired",
                        "detail": "Given token not valid for any token type"
                    }, status=status.HTTP_401_UNAUTHORIZED)

            # Любая другая ошибка токена
            return Response({
                "code": error_data.get("code", "token_invalid"),
                "detail": error_data.get("detail", "Invalid token")
            }, status=status.HTTP_401_UNAUTHORIZED)

        except Exception:
            # Нестандартная ошибка токена
            return Response({
                "code": "token_invalid",
                "detail": "Invalid token"
            }, status=status.HTTP_401_UNAUTHORIZED)

    # JWT / Token ошибки
    if isinstance(exc, (TokenError, AuthenticationFailed)):
        return Response({
            "detail": str(exc)
        }, status=status.HTTP_401_UNAUTHORIZED)

    # Валидация
    if isinstance(exc, ValidationError):
        detail_list = []
        if isinstance(exc.detail, dict):
            for field, messages in exc.detail.items():
                if isinstance(messages, list):
                    for msg in messages:
                        detail_list.append(f"{field}: {msg}")
                else:
                    detail_list.append(f"{field}: {messages}")
        elif isinstance(exc.detail, list):
            detail_list = exc.detail
        else:
            detail_list = [str(exc.detail)]
        return Response({"detail": detail_list}, status=response.status_code)

    # Ошибки доступа
    if isinstance(exc, (NotAuthenticated, PermissionDenied)):
        return Response({"detail": str(exc)}, status=status.HTTP_403_FORBIDDEN)

    # Всё остальное — ошибки, не попавшие в DRF (например, 500)
    if response is None:
        tb = traceback.format_exc()  # Получаем стек вызова в виде строки
        return Response({
            "detail": tb  # Возвращаем подробный traceback в поле detail
        }, status=500)

    # Убедимся, что все ошибки — в поле "detail"
    if isinstance(response.data, dict) and "detail" not in response.data:
        response.data = {"detail": str(exc)}

    return response
