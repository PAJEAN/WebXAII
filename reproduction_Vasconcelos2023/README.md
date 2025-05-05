
To reproduce the work of the following article, follow the instructions below. 
Vasconcelos, Helena, Matthew Jörke, Madeleine Grunde-McLaughlin, Tobias Gerstenberg, Michael S. Bernstein, et Ranjay Krishna. « Explanations Can Reduce Overreliance on AI Systems During Decision-Making ». Proc. ACM Hum.-Comput. Interact. 7, nᵒ CSCW1 (16 avril 2023): 129:1-129:38.


### Commands

Installing the server
```
npm install
```

Building production environment
```
npm run build
```

Running the server at http://localhost:3000
```
node reproduction_Vasconcelos2023/index.js 
```

Use the following identifiers to run each one of the experimental cases.

reprodA : Reproducing the interface of protocol A (difficult/prediction)

reprodB : Reproducing the interface of protocol B (difficult/explanation)

reprodC : Reproducing the interface of protocol C (easy-medium/prediction)

reprodD : Reproducing the interface of protocol D (easy-medium/explanation)
