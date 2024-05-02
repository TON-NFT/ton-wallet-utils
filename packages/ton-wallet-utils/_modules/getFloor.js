import { gql, GraphQLClient } from "graphql-request";
import { XMLHttpRequest } from "xmlhttprequest";

export async function getFloor({ address }) {
  const graphQLClient = new GraphQLClient("https://api.getgems.io/graphql");
  const query = gql`
  {
    alphaNftCollectionStats(address: "${address}") {
      floorPrice
      totalVolume
    }
  }
  `;

  try {
    const results = await graphQLClient.request(query);
    return results.alphaNftCollectionStats.floorPrice;
  } catch (error) {
    console.log(error);
    return fallbackGetFloor({ address });
  }
}

export function fallbackGetFloor({ address }) {
  if (address.length !== 48) return 0;
  const html = getHtml(`https://getgems.io/collection/${address}`);
  const floor = +getStringBetween(html, `"floorPrice":`, `,"`) || null;
  return floor;
}

function getHtml(link) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", link, false);
  xhr.send();
  return xhr.responseText;
}

function getStringBetween(str, start, end) {
  return str.split(start).pop().split(end).shift();
}
