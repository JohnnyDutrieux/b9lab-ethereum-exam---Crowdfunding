# b9lab-ethereum-exam---Crowdfunding
b9lab final exam certified ethereum developer
Can be found at https://github.com/JohnnyDutrieux/b9lab-ethereum-exam---Crowdfunding

The (simple) userinterface of this project consist of 5 parts

1. My Account Overview
  Here you will find an overview of your accounts and their balances. I recommend to have 4 different accounts with some ether

2. Project Overview
  Here you will find an overview the projects. 
  For each project it will show Project Id, owner account, amount needed in Wei, Hors to go before deadline, amount raised and state.
  During deployment a project will be made with id=1, amount_neeeded=2ether and a deadline of 72 hours.
  Depending on the state of the project action buttons will appear.
  State Open: You will be able to fund this project
  State Closed, payout: The project is closed, and a payout to the owner has been done. No further actions.
  State Eligible for refund: Deadline is passed but the amount has not been reached. A refund request can be made.
  
3. Fund a project.
  Here a contribution can made by simply filling in one of your accounts, the amount you want to contribute and then press one of the 
  fund buttons in the project overview
  
4. Request a refund
  Here a refund request can made by simply filling in one of your accounts, and then press one of the request refund buttons in the
  project overview
  
5. Create a project
  Here a new project can be created by filling in project id, owner account (select one of your accounts), amount needed and deadline in hours.
  
Testing: A test is provided to test the refund function. The following scenario will be tested:
  1. Create a new project with owner account[2]
  2. Account[1] one makes a contribution
  4. Assert that the balance of the account has been decreased by at least 0,01 ether
  5. Assert that the raised amount of the project has increased by 0,01 ether
  6. Account one requests a refund.
  7. Assert that the end balance of the account is higher then start balance
  8. Assert that the project raised amount has been decreased by 0,01 ether 
  
Have fun.
Johnny
