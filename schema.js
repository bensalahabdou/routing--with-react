const {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLList,
    GraphQLSchema,
    GraphQLString,
    GraphQLNonNull
} = require('graphql')

const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
]

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
]
const AuthorType = new GraphQLObjectType({
    name:'Author',
    fields: ()=> ({
            id: {type: GraphQLNonNull(GraphQLInt)},
            name: {type: GraphQLNonNull(GraphQLString)},
            books:{
                type: new GraphQLList(BookType),
                resolve(author){
                return books.filter( book => book.authorId === author.id)
            }
        }
           
        })
    });



const BookType = new GraphQLObjectType({
name:'Book',
fields: ()=> ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        authorId: {type: GraphQLNonNull(GraphQLInt)},
        author:{
            type: AuthorType,
            resolve(book){
                return authors.find( author => author.id === book.authorId)
            }
        }
})
});


const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        book:{
            type: BookType,
            args:{
                id: {type: GraphQLInt}
            },
            resolve(parent, args){
                return books.find(book => book.id === args.id)
            }
        },

        books : {
            type: new GraphQLList(BookType),
            resolve: () =>  books
            
        },
        authors:{
            type: new GraphQLList(AuthorType),
            resolve(){
                return authors
            }
        },
        author:{
            type: AuthorType,
            args:{
                id: {type: GraphQLInt}
            },
            resolve(parent, args){
                return authors.find(author => author.id === args.id)
            }
        }
    })
})



const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        addBook:{
            type: BookType,
            args:{
                name: {type: GraphQLNonNull(GraphQLString)},
                authorId: {type: GraphQLNonNull(GraphQLInt)},
            },
            resolve(parent, args){
                const book = {id:books.length+1, name:args.name, authorId:args.authorId}
                books.push(book)
                return book
            }
        }
    
    })
});

module.exports= new GraphQLSchema({
query: RootQueryType,
mutation: RootMutationType
});