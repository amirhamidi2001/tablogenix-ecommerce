from django.urls import path
from .views import OrderListCreateView, OrderDetailView

app_name = "order"

urlpatterns = [
    # GET (list) + POST (create)
    path("", OrderListCreateView.as_view(), name="order-list-create"),
    # GET (detail) + PATCH (cancel)
    path("<int:pk>/", OrderDetailView.as_view(), name="order-detail"),
]
