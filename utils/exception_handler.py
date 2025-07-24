from rest_framework.views import exception_handler
from rest_framework.exceptions import ValidationError, AuthenticationFailed, NotAuthenticated, PermissionDenied
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.exceptions import TokenError
import traceback


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

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

    # Всё остальное — ошибки, не попавшие в DRF (например, 404)
    if response is None:
        return Response({
            "detail": "Произошла внутренняя ошибка сервера"  # или exc.__class__.__name__ для отладки
        }, status=500)

    # Убедимся, что все ошибки — в поле "detail"
    if isinstance(response.data, dict) and "detail" not in response.data:
        response.data = {"detail": str(exc)}

    return response
