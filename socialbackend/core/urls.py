from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import (
    RegisterView,
    PostListCreateView,
    CreateCommentView,
    ListCommentsView,
    LikeToggleView,
    UserPostListView,
    FollowToggleView,
)

from django.http import JsonResponse
from django.urls import path

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('posts/', PostListCreateView.as_view(), name='post-list-create'),
    path('comments/create/', CreateCommentView.as_view(), name='create_comment'),
    path('comments/<int:post_id>/', ListCommentsView.as_view(), name='list_comments'),
    path('posts/<int:post_id>/like/', LikeToggleView.as_view(), name='toggle_like'),
    path('profile/<str:username>/', UserPostListView.as_view(), name='user_posts'),
    path('follow/<str:username>/', FollowToggleView.as_view(), name='follow_toggle'),
]

from .views import user_list

urlpatterns += [
    path('users/', user_list, name='user-list'),
    path("", lambda request: JsonResponse({"message": "Social backend is running ✅"})),
]
