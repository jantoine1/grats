/**
 * Executable schema generated by Grats (https://grats.capt.dev)
 * Do not manually edit. Regenerate by running `npx grats`.
 */
import { id as likeIdResolver } from "./graphql/Node";
import { id as userIdResolver } from "./graphql/Node";
import { id as postIdResolver } from "./graphql/Node";
import { nodes as postConnectionNodesResolver } from "./models/PostConnection";
import { nodes as likeConnectionNodesResolver } from "./models/LikeConnection";
import { likes as queryLikesResolver } from "./models/LikeConnection";
import { node as queryNodeResolver } from "./graphql/Node";
import { nodes as queryNodesResolver } from "./graphql/Node";
import { posts as queryPostsResolver } from "./models/PostConnection";
import { nodes as userConnectionNodesResolver } from "./models/UserConnection";
import { users as queryUsersResolver } from "./models/UserConnection";
import { Viewer as queryViewerResolver } from "./models/Viewer";
import { createLike as mutationCreateLikeResolver } from "./models/Like";
import { createPost as mutationCreatePostResolver } from "./models/Post";
import { createUser as mutationCreateUserResolver } from "./models/User";
import { postLikes as subscriptionPostLikesResolver } from "./models/LikeConnection";
import { GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLString, GraphQLScalarType, GraphQLID, GraphQLInterfaceType, GraphQLBoolean, GraphQLInputObjectType } from "graphql";
export function getSchema(): GraphQLSchema {
    const DateType: GraphQLScalarType = new GraphQLScalarType({
        description: "A date and time. Serialized as a Unix timestamp.\n\n**Note**: The `@specifiedBy` directive does not point to a real spec, but is\nincluded here for demonstration purposes.",
        name: "Date"
    });
    const NodeType: GraphQLInterfaceType = new GraphQLInterfaceType({
        description: "Indicates a stable refetchable object in the system.",
        name: "Node",
        fields() {
            return {
                id: {
                    description: "A globally unique opaque identifier for a node. Can be used to fetch the the\nnode with the `node` or `nodes` fields.\n\nSee: https://graphql.org/learn/global-object-identification/",
                    name: "id",
                    type: GraphQLID
                }
            };
        }
    });
    const PostType: GraphQLObjectType = new GraphQLObjectType({
        name: "Post",
        description: "A blog post.",
        fields() {
            return {
                author: {
                    description: "The author of the post. This cannot change after the post is created.",
                    name: "author",
                    type: UserType
                },
                content: {
                    description: "Content of the post in markdown.",
                    name: "content",
                    type: GraphQLString
                },
                id: {
                    description: "A globally unique opaque identifier for a node. Can be used to fetch the the\nnode with the `node` or `nodes` fields.\n\nSee: https://graphql.org/learn/global-object-identification/",
                    name: "id",
                    type: GraphQLID,
                    resolve(source) {
                        return postIdResolver(source);
                    }
                },
                likes: {
                    description: "All the likes this post has received.\n**Note:** You can use this connection to access the number of likes.",
                    name: "likes",
                    type: LikeConnectionType,
                    args: {
                        after: {
                            name: "after",
                            type: GraphQLString
                        },
                        before: {
                            name: "before",
                            type: GraphQLString
                        },
                        first: {
                            name: "first",
                            type: GraphQLInt
                        },
                        last: {
                            name: "last",
                            type: GraphQLInt
                        }
                    }
                },
                publishedAt: {
                    description: "The date and time at which the post was created.",
                    name: "publishedAt",
                    type: DateType
                },
                title: {
                    description: "The editor-approved title of the post.",
                    name: "title",
                    type: GraphQLString
                }
            };
        },
        interfaces() {
            return [NodeType];
        }
    });
    const PostEdgeType: GraphQLObjectType = new GraphQLObjectType({
        name: "PostEdge",
        fields() {
            return {
                cursor: {
                    name: "cursor",
                    type: GraphQLString
                },
                node: {
                    name: "node",
                    type: PostType
                }
            };
        }
    });
    const PageInfoType: GraphQLObjectType = new GraphQLObjectType({
        name: "PageInfo",
        fields() {
            return {
                endCursor: {
                    name: "endCursor",
                    type: GraphQLString
                },
                hasNextPage: {
                    name: "hasNextPage",
                    type: GraphQLBoolean
                },
                hasPreviousPage: {
                    name: "hasPreviousPage",
                    type: GraphQLBoolean
                },
                startCursor: {
                    name: "startCursor",
                    type: GraphQLString
                }
            };
        }
    });
    const PostConnectionType: GraphQLObjectType = new GraphQLObjectType({
        name: "PostConnection",
        fields() {
            return {
                edges: {
                    name: "edges",
                    type: new GraphQLList(new GraphQLNonNull(PostEdgeType))
                },
                nodes: {
                    description: "Convenience field to get the nodes from a connection.",
                    name: "nodes",
                    type: new GraphQLList(new GraphQLNonNull(PostType)),
                    resolve(source) {
                        return postConnectionNodesResolver(source);
                    }
                },
                pageInfo: {
                    name: "pageInfo",
                    type: PageInfoType
                }
            };
        }
    });
    const UserType: GraphQLObjectType = new GraphQLObjectType({
        name: "User",
        fields() {
            return {
                id: {
                    description: "A globally unique opaque identifier for a node. Can be used to fetch the the\nnode with the `node` or `nodes` fields.\n\nSee: https://graphql.org/learn/global-object-identification/",
                    name: "id",
                    type: GraphQLID,
                    resolve(source) {
                        return userIdResolver(source);
                    }
                },
                name: {
                    description: "User's name. **Note:** This field is not guaranteed to be unique.",
                    name: "name",
                    type: GraphQLString
                },
                posts: {
                    description: "All posts written by this user. Note that there is no guarantee of order.",
                    name: "posts",
                    type: PostConnectionType
                }
            };
        },
        interfaces() {
            return [NodeType];
        }
    });
    const LikeType: GraphQLObjectType = new GraphQLObjectType({
        name: "Like",
        description: "A reaction from a user indicating that they like a post.",
        fields() {
            return {
                createdAt: {
                    description: "The date and time at which the post was liked.",
                    name: "createdAt",
                    type: DateType
                },
                id: {
                    description: "A globally unique opaque identifier for a node. Can be used to fetch the the\nnode with the `node` or `nodes` fields.\n\nSee: https://graphql.org/learn/global-object-identification/",
                    name: "id",
                    type: GraphQLID,
                    resolve(source) {
                        return likeIdResolver(source);
                    }
                },
                liker: {
                    description: "The user who liked the post.",
                    name: "liker",
                    type: UserType
                },
                post: {
                    description: "The post that was liked.",
                    name: "post",
                    type: PostType
                }
            };
        },
        interfaces() {
            return [NodeType];
        }
    });
    const LikeEdgeType: GraphQLObjectType = new GraphQLObjectType({
        name: "LikeEdge",
        fields() {
            return {
                cursor: {
                    name: "cursor",
                    type: GraphQLString
                },
                node: {
                    name: "node",
                    type: LikeType
                }
            };
        }
    });
    const LikeConnectionType: GraphQLObjectType = new GraphQLObjectType({
        name: "LikeConnection",
        fields() {
            return {
                count: {
                    description: "The total number of likes that post has received.\n**Note:** This is separate from the number of edges currently being read.",
                    name: "count",
                    type: GraphQLInt
                },
                edges: {
                    name: "edges",
                    type: new GraphQLList(new GraphQLNonNull(LikeEdgeType))
                },
                nodes: {
                    description: "Convenience field to get the nodes from a connection.",
                    name: "nodes",
                    type: new GraphQLList(new GraphQLNonNull(LikeType)),
                    resolve(source) {
                        return likeConnectionNodesResolver(source);
                    }
                },
                pageInfo: {
                    name: "pageInfo",
                    type: PageInfoType
                }
            };
        }
    });
    const UserEdgeType: GraphQLObjectType = new GraphQLObjectType({
        name: "UserEdge",
        fields() {
            return {
                cursor: {
                    name: "cursor",
                    type: GraphQLString
                },
                node: {
                    name: "node",
                    type: UserType
                }
            };
        }
    });
    const UserConnectionType: GraphQLObjectType = new GraphQLObjectType({
        name: "UserConnection",
        fields() {
            return {
                edges: {
                    name: "edges",
                    type: new GraphQLList(new GraphQLNonNull(UserEdgeType))
                },
                nodes: {
                    description: "Convenience field to get the nodes from a connection.",
                    name: "nodes",
                    type: new GraphQLList(new GraphQLNonNull(UserType)),
                    resolve(source) {
                        return userConnectionNodesResolver(source);
                    }
                },
                pageInfo: {
                    name: "pageInfo",
                    type: PageInfoType
                }
            };
        }
    });
    const ViewerType: GraphQLObjectType = new GraphQLObjectType({
        name: "Viewer",
        description: "The currently authenticated viewer.",
        fields() {
            return {
                feed: {
                    description: "An \"algorithmically generated\" feed of posts.\n\n**Note:** Due to the extreme complexity of this algorithm, it can be slow.\nIt is recommended to use `@stream` to avoid blocking the client.",
                    name: "feed",
                    type: new GraphQLList(new GraphQLNonNull(PostType))
                },
                user: {
                    description: "The currently authenticated user.",
                    name: "user",
                    type: UserType
                }
            };
        }
    });
    const QueryType: GraphQLObjectType = new GraphQLObjectType({
        name: "Query",
        fields() {
            return {
                likes: {
                    description: "All likes in the system. Note that there is no guarantee of order.",
                    name: "likes",
                    type: LikeConnectionType,
                    args: {
                        after: {
                            name: "after",
                            type: GraphQLString
                        },
                        before: {
                            name: "before",
                            type: GraphQLString
                        },
                        first: {
                            name: "first",
                            type: GraphQLInt
                        },
                        last: {
                            name: "last",
                            type: GraphQLInt
                        }
                    },
                    resolve(source, args, context) {
                        return queryLikesResolver(source, args, context);
                    }
                },
                node: {
                    description: "Fetch a single `Node` by its globally unique ID.",
                    name: "node",
                    type: NodeType,
                    args: {
                        id: {
                            name: "id",
                            type: new GraphQLNonNull(GraphQLID)
                        }
                    },
                    resolve(source, args, context) {
                        return queryNodeResolver(source, args, context);
                    }
                },
                nodes: {
                    description: "Fetch a list of `Node`s by their globally unique IDs.",
                    name: "nodes",
                    type: new GraphQLList(NodeType),
                    args: {
                        ids: {
                            name: "ids",
                            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID)))
                        }
                    },
                    resolve(source, args, context) {
                        return queryNodesResolver(source, args, context);
                    }
                },
                posts: {
                    description: "All posts in the system. Note that there is no guarantee of order.",
                    name: "posts",
                    type: PostConnectionType,
                    args: {
                        after: {
                            name: "after",
                            type: GraphQLString
                        },
                        before: {
                            name: "before",
                            type: GraphQLString
                        },
                        first: {
                            name: "first",
                            type: GraphQLInt
                        },
                        last: {
                            name: "last",
                            type: GraphQLInt
                        }
                    },
                    resolve(source, args, context) {
                        return queryPostsResolver(source, args, context);
                    }
                },
                users: {
                    description: "All users in the system. Note that there is no guarantee of order.",
                    name: "users",
                    type: UserConnectionType,
                    args: {
                        after: {
                            name: "after",
                            type: GraphQLString
                        },
                        before: {
                            name: "before",
                            type: GraphQLString
                        },
                        first: {
                            name: "first",
                            type: GraphQLInt
                        },
                        last: {
                            name: "last",
                            type: GraphQLInt
                        }
                    },
                    resolve(source, args, context) {
                        return queryUsersResolver(source, args, context);
                    }
                },
                viewer: {
                    description: "The currently authenticated viewer.",
                    name: "viewer",
                    type: ViewerType,
                    resolve(source) {
                        return queryViewerResolver.viewer(source);
                    }
                }
            };
        }
    });
    const CreateLikePayloadType: GraphQLObjectType = new GraphQLObjectType({
        name: "CreateLikePayload",
        fields() {
            return {
                post: {
                    name: "post",
                    type: PostType
                }
            };
        }
    });
    const CreateLikeInputType: GraphQLInputObjectType = new GraphQLInputObjectType({
        name: "CreateLikeInput",
        fields() {
            return {
                postId: {
                    name: "postId",
                    type: new GraphQLNonNull(GraphQLID)
                }
            };
        }
    });
    const CreatePostPayloadType: GraphQLObjectType = new GraphQLObjectType({
        name: "CreatePostPayload",
        fields() {
            return {
                post: {
                    name: "post",
                    type: PostType
                }
            };
        }
    });
    const CreatePostInputType: GraphQLInputObjectType = new GraphQLInputObjectType({
        name: "CreatePostInput",
        fields() {
            return {
                authorId: {
                    name: "authorId",
                    type: new GraphQLNonNull(GraphQLID)
                },
                content: {
                    name: "content",
                    type: new GraphQLNonNull(GraphQLString)
                },
                title: {
                    name: "title",
                    type: new GraphQLNonNull(GraphQLString)
                }
            };
        }
    });
    const CreateUserPayloadType: GraphQLObjectType = new GraphQLObjectType({
        name: "CreateUserPayload",
        fields() {
            return {
                user: {
                    name: "user",
                    type: UserType
                }
            };
        }
    });
    const CreateUserInputType: GraphQLInputObjectType = new GraphQLInputObjectType({
        name: "CreateUserInput",
        fields() {
            return {
                name: {
                    name: "name",
                    type: new GraphQLNonNull(GraphQLString)
                }
            };
        }
    });
    const MutationType: GraphQLObjectType = new GraphQLObjectType({
        name: "Mutation",
        fields() {
            return {
                createLike: {
                    description: "Like a post. This action is taken as the currently logged in user.",
                    name: "createLike",
                    type: CreateLikePayloadType,
                    args: {
                        input: {
                            name: "input",
                            type: new GraphQLNonNull(CreateLikeInputType)
                        }
                    },
                    resolve(source, args, context) {
                        return mutationCreateLikeResolver(source, args, context);
                    }
                },
                createPost: {
                    description: "Create a new post.",
                    name: "createPost",
                    type: CreatePostPayloadType,
                    args: {
                        input: {
                            name: "input",
                            type: new GraphQLNonNull(CreatePostInputType)
                        }
                    },
                    resolve(source, args, context) {
                        return mutationCreatePostResolver(source, args, context);
                    }
                },
                createUser: {
                    description: "Create a new user.",
                    name: "createUser",
                    type: CreateUserPayloadType,
                    args: {
                        input: {
                            name: "input",
                            type: new GraphQLNonNull(CreateUserInputType)
                        }
                    },
                    resolve(source, args, context) {
                        return mutationCreateUserResolver(source, args, context);
                    }
                }
            };
        }
    });
    const SubscriptionType: GraphQLObjectType = new GraphQLObjectType({
        name: "Subscription",
        fields() {
            return {
                postLikes: {
                    description: "Subscribe to likes on a post.\n**Note:** Does not immediately return likes, but rather updates as likes are applied.",
                    name: "postLikes",
                    type: LikeConnectionType,
                    args: {
                        postID: {
                            name: "postID",
                            type: new GraphQLNonNull(GraphQLString)
                        }
                    },
                    subscribe(source, args, context) {
                        return subscriptionPostLikesResolver(source, args, context);
                    },
                    resolve(payload) {
                        return payload;
                    }
                }
            };
        }
    });
    return new GraphQLSchema({
        query: QueryType,
        mutation: MutationType,
        subscription: SubscriptionType,
        types: [DateType, NodeType, CreateLikeInputType, CreatePostInputType, CreateUserInputType, CreateLikePayloadType, CreatePostPayloadType, CreateUserPayloadType, LikeType, LikeConnectionType, LikeEdgeType, MutationType, PageInfoType, PostType, PostConnectionType, PostEdgeType, QueryType, SubscriptionType, UserType, UserConnectionType, UserEdgeType, ViewerType]
    });
}