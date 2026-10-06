import os
import sys
import pytest
import importlib

def test_auth_import_fails_without_jwt_secret(monkeypatch):
    monkeypatch.setenv("JWT_SECRET", "")
    if "app.auth" in sys.modules:
        del sys.modules["app.auth"]
    
    with pytest.raises(ValueError, match="CRITICAL SECURITY ERROR"):
        importlib.import_module("app.auth")

def test_auth_import_fails_with_insecure_default_secret(monkeypatch):
    monkeypatch.setenv("JWT_SECRET", "supersecretkey")
    if "app.auth" in sys.modules:
        del sys.modules["app.auth"]
    
    with pytest.raises(ValueError, match="CRITICAL SECURITY ERROR"):
        importlib.import_module("app.auth")
