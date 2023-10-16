Feature: Get product reviews from a product
  As a user with permissions
  I want to get product reviews from a specific product

  Scenario: Existing product
    Given the following event is received:
    """
    {
      "data": {
        "id": "e6d00be5-529d-49ca-a66a-e97bba504f79",
        "type": "product.created",
        "occurred_on": "2023-07-05T14:53:32.377Z",
        "aggregateId": "b1e1eace-0111-4dd3-9298-124a64807175",
        "data": {
          "name": "reprehenderit",
          "description": "porro",
          "images": ["nisi"],
          "price": "33769",
          "brand": "unde",
          "category": "possimus",
          "ean": "debitis",
          "active": true,
          "createdAt": "2023-07-05T14:53:32.377Z"
        }
      }
    }
    """
    And another event is received:
    """
    {
      "data": {
        "id": "e515cff5-4e9d-4d46-874a-ee3b2ef5b390",
        "type": "product_review.created",
        "occurred_on": "2023-07-05T14:54:37.993Z",
        "aggregateId": "bfd87817-dca3-47a8-baa3-4bcb451ee785",
        "data": {
          "productId": "e6d00be5-529d-49ca-a66a-e97bba504f79",
          "userId": "4b75043b-3d9c-42ad-ac00-8630d8435cd2",
          "rating": 5,
          "comment": "Nice product, it is perfect."
        }
      }
    }
    """
    And I send a GET request to "/product-review/product/e6d00be5-529d-49ca-a66a-e97bba504f79"
    Then the response status code should be 200
    And the response should be:
    """
    {
      "data": [
        {
          "id": "bfd87817-dca3-47a8-baa3-4bcb451ee785",
          "productId": "e6d00be5-529d-49ca-a66a-e97bba504f79",
          "userId": "4b75043b-3d9c-42ad-ac00-8630d8435cd2",
          "rating": 5,
          "comment": "Nice product, it is perfect."
        }
      ],
      "message": "Successfully retrieved product reviews",
      "status": 200
    }
    """
