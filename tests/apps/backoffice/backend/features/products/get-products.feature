Feature: Get products
  As a user with permissions
  I want to get products

  Scenario: All existing products
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
          "image": "nisi",
          "price": "33769",
          "brand": "unde",
          "category": "possimus",
          "ean": "debitis"
        }
      }
    }
    """
    And another event is received:
    """
    {
      "data": {
        "id": "e515cff5-4e9d-4d46-874a-ee3b2ef5b390",
        "type": "product.created",
        "occurred_on": "2023-07-05T14:54:37.993Z",
        "aggregateId": "bfd87817-dca3-47a8-baa3-4bcb451ee785",
        "data": {
          "name": "qui",
          "description": "nesciunt",
          "image": "qui",
          "price": "50840",
          "brand": "consequatur",
          "category": "temporibus",
          "ean": "est"
        }
      }
    }
    """
    And I send a GET request to "/product"
    Then the response status code should be 200
    And the response should be:
    """
    {
      "data": [
        {
            "id": "b1e1eace-0111-4dd3-9298-124a64807175",
            "name": "reprehenderit",
            "description": "porro",
            "image": "nisi",
            "price": "33769",
            "brand": "unde",
            "category": "possimus",
            "ean": "debitis"
        },
        {
            "id": "bfd87817-dca3-47a8-baa3-4bcb451ee785",
            "name": "qui",
            "description": "nesciunt",
            "image": "qui",
            "price": "50840",
            "brand": "consequatur",
            "category": "temporibus",
            "ean": "est"
        }
      ],
      "message": "Successfully retrieved products",
      "status": 200
    }
    """
