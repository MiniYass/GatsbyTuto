const path = require("path")
const { createFilePath } = require("gatsby-source-filesystem")
// creation du slug pour post et pages
exports.onCreateNode = ( { node, getNode, actions }) => {
    const { createNodeField } = actions;
    if(node.internal.type === `MarkdownRemark`) {
        const slug = createFilePath({
            node,
            getNode,
            basePath: `content`,
        })

        createNodeField({
            node,
            name:`slug`,
            value: slug,
        })
    }
}

exports.createPages = async ({ actions , graphql }) => {

    const { createPage } = actions;
    const content = await graphql(`
        {
        posts: allMarkdownRemark( filter: { frontmatter : { type: {eq: "post" } } } )
            {
            edges {
                node{
                    frontmatter{
                        published
                    }
                    fields{
                        slug
                    }
                }
            }
        }

        pages: allMarkdownRemark( filter: { frontmatter: { type:{eq: "page" } } }
        ) {
            edges{
                node{
                    fields{
                        slug
                    }
                }
            }
        }
    }
    `)
    // do nothing more error
    if(content.error) return;

    const allPosts = content.data.posts.edges;
    const allPages = content.data.pages.edges;



    // create the individual post pages

    allPosts.forEach(({ node }) => {
        if(node.frontmatter.published){
            actions.createPage({
                path: node.fields.slug,
                component: path.resolve(`./src/templates/Post.js`),
                context: {
                    // data passed to context available
                    // in page queries as graphql variable
                    slug : node.fields.slug,
                },
            })
        }
    })

// create the individual pages
    allPages.forEach(({ node }) => {
        actions.createPage({
            path: node.fields.slug,
            component: path.resolve(`./src/templates/Page.js`),
            context: {
                // data passed to context available
                // in page queries as graphql variable
                slug : node.fields.slug,
            },
        })
    })

    //creation archive pages 
    const postsPerPage=5;
    const numPages = Math.ceil(allPosts.length / postsPerPage);
    Array.from({ length: numPages }).forEach((_, i) => {
        actions.createPage({
            path: i===0 ? `/` : `/${i + 1}`,
            component: path.resolve(`./src/templates/Home.js`) ,
            context: {
                limit: postsPerPage,
                skip: i * postsPerPage,
                numPages,
                currentPage: i+1 ,
            },
        })
    })

}



// absolute import
exports.onCreateWebpackConfig =({ actions }) => {
    actions.setWebpackConfig({
        resolve: {
            modules: [path.resolve(__dirname, 'src'), "node_modules"],
        },
    })
}