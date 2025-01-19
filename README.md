# Fruits and Squares

A collection of randomly generated fruit puzzle games. Users can sign in via LinkedIn to compare scores on the top games or play endless games without an account.

Mango is a 6x6 grid filled with bananas and mangos, following a similar ruleset to LinkedIn's [Tango](https://www.linkedin.com/showcase/tango-game/), except there may be more than one valid solution.

Beans is a 10x10 grid, divided in 10 areas, following a similar ruleset to LinkedIn's [Queens](https://www.linkedin.com/showcase/queens-game/), except there may be more than one valid solution.


## Mango generation logic

First we consider only the constraints on fruits positioning to generate a valid arrangement:
- Only 3 of each fruit per row and per column
- No more than 2 consecutive fruits in any row or column

To fill the board, we repeatedly select a random square and check if adding either fruit would result in a valid board state. If only one fruit is valid, that fruit is added. If both are valid, the fruit that is on the board the least is added.

This method can result in states where neither fruit is valid. In this case, we reset the board and try again (up to 1,000 times).

Once we have a valid arrangement of fruits, we add the + and = signs in random places, ensuring these signs correspond to the existing arrangement.

Then we select 12 random cells that are not next to a + or = and set them to fixed. A maximum of two fixed cells per row or column is allowed.

Finally, the fruits in any cells that aren't fixed are removed and the game board is complete.

## Setup information

The project is built in Vite using React and TypeScript.

## LinkedIn authentication for Firebase

Users can sign into their LinkedIn using OpenID Connect. Documentation for how this works is available [here](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2).

Once authenticated via LinkedIn, an account is created from the user's details and a custom token is returned to the client. Documentation [here](https://firebase.google.com/docs/auth/admin/create-custom-tokens).

## Disclaimer

Fruits & Squares is an independent product and is not affiliated with, nor has it been authorized, sponsored, or otherwise approved by LinkedIn Corporation. 

Users are encouraged to play the games these puzzles are inspired by, namely [Tango](https://www.linkedin.com/showcase/tango-game/) and [Queens](https://www.linkedin.com/showcase/queens-game/).