Contents
==

The code separated to several modules, such as:
* Lexer
* Parser
* Interpreter

Lexer
--

A lexer generates tokens from the given source. Tokens are literally words of the source, they additionally cover operators (can be arithmetical or logical operators like +, -, *, /, |, &) and special symbols (like parenthesis in our case).

Parser
--

A parser is a function that converts the given tokens into expression trees (AST - Abstract Syntax Tree). For example, a set of tokens like (* 2 2) is converted into a multiplication expression with 2 parameters.

Interpreter
--

An interpreter is an evaluation function that can evaluate the given expression(s). For example, (* 2 2), which is a multiplication expression's evaluation result is 4.  