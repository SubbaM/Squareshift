# Mentioned APIs have been implemented for the eCommerce application

Swagger is exposed at /api-docs

Assumptions & Understandings -
    * Simple JSON file is used for storing the cart items. DB implementation not done
    * While adding items to the cart, if the item is already present, it is not added again to the cart
    * While calculating the shipping cost, there was a confusion with boundary conditions. So I have chosen an optimal strategy
    * The calculated cost has been rounded off to 2 decimals
    * Cloud deployment hasnt been done, since I have exhausted my free tier in Azure. I have experience in setting up pipelines in Azure DevOps
    * dotenv package has been used to implement the API URL handling for various environments such Dev/QA/Prod. In realtime, these values can be stored as cloud environment variables

Next steps -
    * Implement Unit test cases and ensure code coverage of 80-85%
