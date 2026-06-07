// Combined GraphQL query strings — use with shopifyFetch() from lib/shopify.ts

export const GET_PRODUCTS_BY_COLLECTION = `
  query GetProductsByCollection(
    $handle: String!
    $first: Int!
    $after: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $filters: [ProductFilter!]
  ) {
    collection(handle: $handle) {
      id
      title
      description
      seo { title description }
      products(
        first: $first
        after: $after
        sortKey: $sortKey
        reverse: $reverse
        filters: $filters
      ) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        filters {
          id
          label
          type
          values { id label count input }
        }
        edges {
          cursor
          node {
            id
            title
            handle
            description
            descriptionHtml
            tags
            vendor
            productType
            availableForSale
            priceRange {
              minVariantPrice { amount currencyCode }
              maxVariantPrice { amount currencyCode }
            }
            compareAtPriceRange {
              minVariantPrice { amount currencyCode }
              maxVariantPrice { amount currencyCode }
            }
            featuredImage { url altText width height }
            images(first: 2) {
              nodes { url altText width height }
            }
            variants(first: 1) {
              nodes {
                id
                title
                availableForSale
                quantityAvailable
                price { amount currencyCode }
                compareAtPrice { amount currencyCode }
                selectedOptions { name value }
              }
            }
          }
        }
      }
    }
  }
`

export const GET_PRODUCT_BY_HANDLE = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      vendor
      productType
      tags
      availableForSale
      seo { title description }
      priceRange {
        minVariantPrice { amount currencyCode }
        maxVariantPrice { amount currencyCode }
      }
      compareAtPriceRange {
        minVariantPrice { amount currencyCode }
        maxVariantPrice { amount currencyCode }
      }
      images(first: 10) {
        nodes { id url altText width height }
      }
      featuredImage { url altText width height }
      options {
        id
        name
        values
      }
      variants(first: 100) {
        nodes {
          id
          title
          availableForSale
          quantityAvailable
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          selectedOptions { name value }
          image { url altText }
        }
      }
      metafields(identifiers: [
        { namespace: "custom", key: "country_of_origin" },
        { namespace: "custom", key: "volume" }
      ]) {
        key
        value
      }
    }
  }
`

export const GET_ALL_COLLECTIONS = `
  query GetAllCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image { url altText width height }
          seo { title description }
        }
      }
    }
  }
`

export const GET_ALL_VENDORS = `
  query GetAllVendors($first: Int!) {
    products(first: $first) {
      edges {
        node {
          vendor
        }
      }
    }
  }
`

export const SEARCH_PRODUCTS = `
  query SearchProducts($query: String!, $first: Int!, $after: String) {
    search(query: $query, first: $first, after: $after, types: [PRODUCT]) {
      pageInfo { hasNextPage endCursor }
      edges {
        node {
          ... on Product {
            id
            title
            handle
            description
            descriptionHtml
            vendor
            productType
            tags
            featuredImage { url altText width height }
            images(first: 1) { nodes { url altText width height } }
            priceRange {
              minVariantPrice { amount currencyCode }
              maxVariantPrice { amount currencyCode }
            }
            compareAtPriceRange {
              minVariantPrice { amount currencyCode }
              maxVariantPrice { amount currencyCode }
            }
            variants(first: 1) {
              nodes {
                id
                title
                availableForSale
                quantityAvailable
                price { amount currencyCode }
                compareAtPrice { amount currencyCode }
                selectedOptions { name value }
              }
            }
          }
        }
      }
    }
  }
`

export const PREDICTIVE_SEARCH = `
  query PredictiveSearch($query: String!) {
    predictiveSearch(query: $query, types: [PRODUCT, COLLECTION]) {
      products {
        id
        title
        handle
        featuredImage { url altText width height }
        priceRange {
          minVariantPrice { amount currencyCode }
        }
      }
      collections {
        id
        title
        handle
      }
    }
  }
`

export const CREATE_CART = `
  mutation CreateCart($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          subtotalAmount { amount currencyCode }
          totalAmount { amount currencyCode }
        }
        lines(first: 100) {
          nodes {
            id
            quantity
            cost { totalAmount { amount currencyCode } }
            merchandise {
              ... on ProductVariant {
                id
                title
                price { amount currencyCode }
                compareAtPrice { amount currencyCode }
                image { url altText }
                product { title handle featuredImage { url } }
              }
            }
          }
        }
      }
      userErrors { field message }
    }
  }
`

export const ADD_CART_LINES = `
  mutation AddCartLines($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { id totalQuantity cost { subtotalAmount { amount currencyCode } } }
      userErrors { field message }
    }
  }
`

export const UPDATE_CART_LINES = `
  mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { id totalQuantity cost { subtotalAmount { amount currencyCode } } }
      userErrors { field message }
    }
  }
`

export const REMOVE_CART_LINES = `
  mutation RemoveCartLines($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { id totalQuantity cost { subtotalAmount { amount currencyCode } } }
      userErrors { field message }
    }
  }
`

export const GET_CART = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      totalQuantity
      cost {
        subtotalAmount { amount currencyCode }
        totalTaxAmount { amount currencyCode }
        totalAmount { amount currencyCode }
      }
      lines(first: 100) {
        nodes {
          id
          quantity
          cost { totalAmount { amount currencyCode } }
          merchandise {
            ... on ProductVariant {
              id
              title
              price { amount currencyCode }
              compareAtPrice { amount currencyCode }
              image { url altText }
              product {
                id
                title
                handle
                featuredImage { url altText }
              }
            }
          }
        }
      }
    }
  }
`
