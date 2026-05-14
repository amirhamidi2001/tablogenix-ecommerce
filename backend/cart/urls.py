from django.urls import path
from .views import CartView, CartItemView, CartClearView

app_name = "cart"

urlpatterns = [
    # GET (retrieve cart) + POST (add item)
    path("", CartView.as_view(), name="cart"),
    # PUT/PATCH (update qty) + DELETE (remove item)
    path("item/<int:item_id>/", CartItemView.as_view(), name="cart-item"),
    # DELETE (clear entire cart)
    path("clear/", CartClearView.as_view(), name="cart-clear"),
]
