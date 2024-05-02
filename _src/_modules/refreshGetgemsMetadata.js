import { gql, GraphQLClient } from 'graphql-request'

export async function refreshGetgemsMetadata({ address }) {
  const graphQLClient = new GraphQLClient('https://api.getgems.io/graphql')
  const query = gql`
  mutation {
    nftRefreshMetadata(address: "${address}") {
      name,
      description,
    }
  }
  `
  try {
    const result = await graphQLClient.request(query)
    return result.nftRefreshMetadata
  } catch (error) {
    console.log(error)
    return false
  }
}