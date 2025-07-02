from django.contrib.auth.models import User
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView

from .models import Post, Comment, Like, Follow
from .serializers import RegisterSerializer, PostSerializer, CommentSerializer

# User Registration
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

# List and Create Posts
class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_serializer_context(self):
        return {'request': self.request}


# Comment Creation
class CreateCommentView(generics.CreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# List Comments for a Specific Post
class ListCommentsView(generics.ListAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        post_id = self.kwargs['post_id']
        return Comment.objects.filter(post__id=post_id).order_by('-created_at')

# Toggle Like/Unlike on Post
class LikeToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, post_id):
        post = Post.objects.get(id=post_id)
        user = request.user
        like, created = Like.objects.get_or_create(user=user, post=post)

        if not created:
            like.delete()
            return Response({'message': 'Unliked'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Liked'}, status=status.HTTP_201_CREATED)

# List All Posts by a Specific User
class UserPostListView(ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        username = self.kwargs['username']
        return Post.objects.filter(user__username=username).order_by('-created_at')

# Toggle Follow/Unfollow
class FollowToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, username):
        try:
            to_follow = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

        user = request.user
        if user == to_follow:
            return Response({'error': 'You cannot follow yourself'}, status=400)

        follow, created = Follow.objects.get_or_create(follower=user, following=to_follow)

        if not created:
            follow.delete()
            return Response({'message': 'Unfollowed'}, status=200)
        else:
            return Response({'message': 'Followed'}, status=201)

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_list(request):
    current_user = request.user
    users = User.objects.exclude(id=current_user.id)
    data = []
    for user in users:
        is_following = Follow.objects.filter(follower=current_user, following=user).exists()
        data.append({
            'username': user.username,
            'is_following': is_following
        })
    return Response(data)
