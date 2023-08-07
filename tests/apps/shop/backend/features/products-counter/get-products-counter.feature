Feature: Obtain the total number of products
  In order to have a products counter
  As a user
  I want to see the products counter

  Scenario: With one product
    Given the following event is received:
    """
    {
      "data": {
        "id": "c77fa036-cbc7-4414-996b-c6a7a93cae09",
        "type": "product.created",
        "occurred_on": "2019-08-08T08:37:32+00:00",
        "aggregateId": "8c900b20-e04a-4777-9183-32faab6d2fb5",
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
    When I send a GET request to "/products-counter"
    Then the response status code should be 200
    And the response should be:
    """
    {
      "status": 200,
      "message": "Successfully retrieved products count",
      "total": 1
    }
    """


  Scenario: With more than one product having duplicates
    Given the following event is received:
    """
    {
      "data": {
        "id": "c77fa036-cbc7-4414-996b-c6a7a93cae09",
        "type": "product.created",
        "occurred_on": "2019-08-08T08:37:32+00:00",
        "aggregateId": "8c900b20-e04a-4777-9183-32faab6d2fb5",
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
        "id": "8c4a4ed8-9458-489e-a167-b099d81fa096",
        "type": "product.created",
        "occurred_on": "2019-08-09T08:36:32+00:00",
        "aggregateId": "8c4a4ed8-9458-489e-a167-b099d81fa096",
        "data": {
          "name": "reprehenderit 2",
          "description": "porro 2",
          "image": "nisi 2",
          "price": "55555",
          "brand": "unde 2",
          "category": "possimus 2",
          "ean": "debitis 2"
        }
      }
    }
    """
    And another event is received:
    """
    {
      "data": {
        "id": "8c4a4ed8-9458-489e-a167-b099d81fa096",
        "type": "product.created",
        "occurred_on": "2019-08-09T08:36:32+00:00",
        "aggregateId": "8c4a4ed8-9458-489e-a167-b099d81fa096",
        "data": {
          "name": "reprehenderit 2",
          "description": "porro 2",
          "image": "nisi 2",
          "price": "55555",
          "brand": "unde 2",
          "category": "possimus 2",
          "ean": "debitis 2"
        }
      }
    }
    """
    When I send a GET request to "/products-counter"
    Then the response status code should be 200
    And the response should be:
    """
    {
      "status": 200,
      "message": "Successfully retrieved products count",
      "total": 2
    }
    """
