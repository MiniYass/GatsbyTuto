import { useStaticQuery , graphql } from "gatsby"

export const useHeroQuery = () => {
    const data = useStaticQuery(graphql`
        query HeroQuery{
            markdownRemark(frontmatter: {type: {eq: "hero"}}) {
                frontmatter {
                    heroImageBtnLink
                    heroImageBtnText
                    heroImageText
                    heroImage {
                        childImageSharp {
                          fluid(maxWidth: 2000) {
                            ...GatsbyImageSharpFluid
                          }
                        }
                      }
                }
              }
            }
            
    `)

    return data.markdownRemark.frontmatter

}