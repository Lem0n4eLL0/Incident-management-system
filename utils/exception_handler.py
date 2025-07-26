from rest_framework.views import exception_handler
from rest_framework.exceptions import ValidationError, AuthenticationFailed, NotAuthenticated, PermissionDenied
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.exceptions import TokenError
import traceback
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    
    if isinstance(exc, InvalidToken):
        try:
            error_data = exc.detail  

            
            if error_data.get("code") == "token_not_valid":
                
                for msg in error_data.get("messages", []):
                    if msg.get("message") == "Token is expired":
                        return Response({
                            "code": "token_expired",
                            "detail": "Given token not valid for any token type"
                        }, status=status.HTTP_401_UNAUTHORIZED)

                
                if "Token is expired" in error_data.get("detail", ""):
                    return Response({
                        "code": "token_expired",
                        "detail": "Given token not valid for any token type"
                    }, status=status.HTTP_401_UNAUTHORIZED)

            
            return Response({
                "code": error_data.get("code", "token_invalid"),
                "detail": error_data.get("detail", "Invalid token")
            }, status=status.HTTP_401_UNAUTHORIZED)

        except Exception:
            
            return Response({
                "code": "token_invalid",
                "detail": "Invalid token"
            }, status=status.HTTP_401_UNAUTHORIZED)

    
    if isinstance(exc, (TokenError, AuthenticationFailed)):
        return Response({
            "detail": str(exc)
        }, status=status.HTTP_401_UNAUTHORIZED)

    
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

    
    if isinstance(exc, (NotAuthenticated, PermissionDenied)):
        return Response({"detail": str(exc)}, status=status.HTTP_403_FORBIDDEN)

    
    if response is None:
        tb = traceback.format_exc()  
        return Response({
            "detail": tb  
        }, status=500)

    
    if isinstance(response.data, dict) and "detail" not in response.data:
        response.data = {"detail": str(exc)}

    return response
