
// Function for Classic mode from Home Page
function classicFun(){

    //Transition from home page to classic mode
    document.body.style.backgroundImage="none";
    document.body.style.backgroundColor="blue";


    main[0].style.display="none";
    document.getElementById("footerIcons").style.display="none";
    document.getElementById("profile").style.display="none";
    document.getElementById("name").style.display="none";
    document.getElementById("player").style.display="flex";

    let classic=document.getElementsByClassName("classMode");

    document.getElementById("backArr").style.display="block";
    document.getElementById("cMode").style.display="block";
    document.getElementById("foot").style.display="flex";

    // Fitting content that is in this page
    classic[0].style.display="flex";
    classic[0].style.gap="30px";
    classic[0].style.height="100%";
    
    //Event listener for Single/Doubles mode
    let sgl=document.getElementsByClassName("single");
    let dbl=document.getElementsByClassName("double");

    sgl[0].addEventListener("click",()=>{
        sgl[1].style.display="inline";
        dbl[1].style.display="none";

    })
    dbl[0].addEventListener("click",()=>{
        dbl[1].style.display="inline";
        sgl[1].style.display="none";

    })
    
}

// For Classic Mode
let main=document.getElementsByClassName("main");
let classic=document.getElementsByClassName("card");

classic[0].addEventListener("click",()=>{
    classicFun();
});

// For after clicking something in the classic mode 
let playerChoosing = document.getElementsByClassName("classical");
let clicked="";

for(let idx=0;idx<playerChoosing.length;idx++){
    playerChoosing[idx].addEventListener("click",()=>{
        clicked=playerChoosing[idx].dataset.value;
        randomPlayer(clicked);
    })
}

//Function for opponent choosing page
function randomPlayer(clicked){

    //Transition from classic mode to opponent choosing page
    document.getElementById("foot").style.display="none";
    document.getElementById("cMode").style.display="none";
    document.getElementById("player").style.display="none";
    main[1].style.display="none";
    document.getElementById("opponentDiv").style.display="block";
    document.getElementsByClassName("oppoFoot")[0].style.display="block";
    document.getElementsByClassName("oppoFoot")[1].style.display="inline";
}

// Event Listener for Start button in the Opponent page
let startBTN = document.getElementsByClassName("oppoFoot")[1];
startBTN.addEventListener("click",()=>{
    gamingPage();
})

// Function for Real UNO Deck generating
function createUNO(){
    let UNOdeck=[];

    // For 4 colors
    for(let color=0;color<4;color++){

        // For 0 card
        UNOdeck.push({
            number : 0,
            color : color,
            prior : 1
        });
        
        // For x2
        for(let idx=0;idx<2;idx++){
            // For 1-9 cards 
            for(let num=1;num<10;num++){
                UNOdeck.push({
                    number : num,
                    color : color,
                    prior : 1
                })
            }

            // For skip
            UNOdeck.push({
                number : 10,
                color : color,
                prior : 2
            });

            // For reverse
            UNOdeck.push({
                number : 11,
                color : color,
                prior : 2
            });

            // For +2
            UNOdeck.push({
                number : 12,
                color : color,
                prior : 2
            });
        }

        // For color
        UNOdeck.push({
            number : 13,
            color : 4,
            prior : 3
        });

        // For +4
        UNOdeck.push({
            number : 13,
            color : 5,
            prior : 3
        });
    }
    return UNOdeck;
}

// For random shuffle using Fisher Yates Shuffle method
function shuffle(deck){
    for(let idx1=deck.length -1;idx1>0;idx1--){
        let idx2=Math.floor(Math.random()*(idx1+1));
        [deck[idx1],deck[idx2]]=[deck[idx2],deck[idx1]];
    }
}

// Function for div card creating
function createDivCards(cardData){
    let cardDiv=document.createElement("div");

    cardDiv.dataset.number = cardData.number;
    cardDiv.dataset.color = cardData.color;
    cardDiv.dataset.priority = cardData.prior;

    let column = cardData.number;
    let row = cardData.color;

    if((cardData.number == 13) && (cardData.color == 4)){
        row=2;
    }
    let x = -((85*column)+3);
    let y = -(128*row);
    
    cardDiv.style.backgroundPosition = `${x}px ${y}px`;

    return cardDiv;
}

// Creating and shuffle the decks
let gameCards=createUNO();
shuffle(gameCards);


// Variable for switching among player
let deck=document.getElementsByClassName("deck");

//Function for the Gaming Page
function gamingPage(){

    // Transition from the Opponent Page to Gaming Page
    document.getElementById("home").style.display="none";

    document.body.style.backgroundImage='url("./assets/playing.png")';
    document.getElementById("gamePage").style.display="flex";

    // Initial card at discard deck
    let firstCard;
    do{
        firstCard=gameCards.pop();
        if(firstCard.prior !== 1){
            gameCards.unshift(firstCard);
        }
    }while(firstCard.prior !== 1)
    
    let discardCard=createDivCards(firstCard);    
    discardCard.classList.add("discardChild");
    
    document.getElementById("discardDeck").appendChild(discardCard);

    // Draw deck
    let draw = document.getElementById("drawDeck");
    
    for(let idx1=0;idx1<4;idx1++){
        // Initial 7 cards generating
        for(let idx=0;idx<7;idx++){

            let playingCard=createDivCards(gameCards.pop());
            // console.log(playingCard);
            
            deck[idx1].appendChild(playingCard);
            playingCard.classList.add("playCard");

            // Adding Event Listener to bottom player only
            if(idx1 == 3){
                eventListener(playingCard);
            }

            // Animation for Draw deck
            setTimeout(()=>{
                animateDraw();
            },idx*200);

            
        }
    }

    // Draw a card from a deck
    draw.addEventListener("click",()=>{
        drawCards(3);
        let drawedCard = deck[3].lastChild;
        if(canplay(drawedCard)){
            let discardDeck = document.getElementById("discardDeck");
            discardDeck.innerHTML="";
            discardDeck.appendChild(drawedCard);

            // For Special Cards
            if(drawedCard.dataset.number>9 || drawedCard.dataset.color>3){
                special();
                if(waitingColor){
                    return;
                }
            }
        }
        nextTurn();
        switching();
    })
    
}

// Function to Add Event Listener ( Only for botom player )
function eventListener(card){
    
    return card.addEventListener("click",()=>{
        let discardDeck = document.getElementById("discardDeck");
        let discard = discardDeck.firstElementChild;

        console.log("clicked",card.innerText);
        console.log("playing Card:",card.dataset.number,card.dataset.color);
        console.log("Discard Card:",discard.dataset.number,discard.dataset.color);

        if(canplay(card)){
            
            discardDeck.innerHTML="";
            discardDeck.appendChild(card);

            // For Special Cards
            if(card.dataset.number>9 || card.dataset.color>3){
                special();
                if(waitingColor){
                    return;
                }
            }

            if(checkWinner(3)){
                return;
            }

            nextTurn();
            switching();
        }
    })
}

// Event listener for color picking (only for bottom player)
let colorChoose = document.getElementsByClassName("clrDiv");
for(let idx of colorChoose){
    
    idx.addEventListener("click",()=>{
        let discard = document.getElementById("discardDeck").firstElementChild;
        let isPlus4 = discard.dataset.color;
        picked=idx.dataset.index;
        document.getElementById("colorPick").style.display="none";
        waitingColor=false;

        discard.dataset.color=picked;
        picked=10;
        console.log("color human:",discard.dataset.color);
        

        // For +4 Card
        if(isPlus4 == 5){
            nextTurn();
            drawCards(currentTurn);
            drawCards(currentTurn);
            drawCards(currentTurn);
            drawCards(currentTurn);
        }
        nextTurn();
        switching();
    })
}

// Function to check the valid card to play
function canplay(card){
    let discard = document.getElementById("discardDeck").firstElementChild;

    if (
        (card.dataset.color === discard.dataset.color) || 
        (card.dataset.number === discard.dataset.number)
    ){
        return true;
    }else if ((card.dataset.color == 4) || (card.dataset.color == 5)){
        return true;
    }else{
        return false;
    }
}

// Function for draw a card
function drawCards(idx){

    if(gameCards.length === 0){
        console.log("Deck Empty");
        return;
    }

    let playingCard=createDivCards(gameCards.pop());
    animateDraw();
    deck[idx].appendChild(playingCard);
    playingCard.classList.add("playCard");

    if(idx == 3){
        eventListener(playingCard);
    }
}

// Function for computer play
function  computerPlay(idx){
    let len = deck[idx].children.length;
    let container=deck[idx];
    let discardDeck = document.getElementById("discardDeck");
    let validCards=[];

    for(let idx1=0;idx1<len;idx1++ ){
        let card=container.children[idx1];

        if(canplay(card)){
            validCards.push(card);
        }
        
    }

    if(validCards.length === 0){
        // No playable card
        drawCards(idx);
        let drawedCard = deck[idx].lastChild;
        if(canplay(drawedCard)){
            validCards.push(drawedCard);
        }else{
            return;
        }
    }

    validCards.sort((a,b)=>
        Number(a.dataset.priority) -
        Number(b.dataset.priority)
    );

    let validPlay = validCards[0];    

    discardDeck.innerHTML="";
    discardDeck.appendChild(validPlay);

    // For Special Cards
    if(validPlay.dataset.number>9 || validPlay.dataset.color>3){
        special();
        if(validPlay.dataset.color == 4 || validPlay.dataset.color == 5){
                    
            if(picked!=10){
                if(picked === 4)
                    picked=0;
                validPlay.dataset.color=picked;
                console.log("Changed color is:",picked);
                picked=10;
            }
        }
    }

    if(len === 2){
        unoFunc();
    }

    if(checkWinner(idx)){
        return;
    }
    
    return;
}

// Function for next turn
let currentTurn=3;

// To highlight the current turn if the player
let highlightCurrentTurn=document.getElementsByClassName("avatar");
    highlightCurrentTurn[currentTurn].style.border=" 4px solid yellow";

let order=[3,1,0,2];
let arrIdx=0;
let flag=false; // For reverse

function nextTurn(){
    clearHighlight();

    if (flag === false) {
        // For Ascending Order
        arrIdx = (arrIdx + 1) % 4; 
    } else {
        // For Descending Order
        arrIdx = (arrIdx - 1 + 4) % 4;
    }

    currentTurn = order[arrIdx];
    
    highlightCurrentTurn[currentTurn].style.border=" 4px solid yellow";
}

// For Clearing Highlights
let clearHighlight=()=>{
    idx=0;
    while(idx < 4){
        highlightCurrentTurn[idx].style.border="none";
        idx++;
    }
}

// Function for switching
function switching(){
    if(gameOver){
        return;
    }
    if(currentTurn === 3){
        console.log("Human Turn");
        return;
    }
    setTimeout(()=>{
        if(gameOver){
            return;
        }
        computerPlay(currentTurn);
        if(gameOver){
            return;
        }
        nextTurn();
        switching();
    },3000);
}

// Function for checkiing if game is over
let gameOver=false;

function checkWinner(index){
    if(deck[index].children.length === 0){
        gameOver = true;

        if(index === 3){
            alert("You Win !!!");
        }else{
            alert(`Computer:${index} Wins !!!`);
        }
        return true;
    }
    return false;
}

// Function for Special Cards
let picked=10;
let waitingColor=false;

function special(){
    let discard = document.getElementById("discardDeck").firstElementChild;
    
    // For +2 Card
    if(discard.dataset.number == 12){
        console.log("+2 Activated");
        nextTurn();
        drawCards(currentTurn);
        drawCards(currentTurn);
    }

    // For card Skip Card
    if(discard.dataset.number == 10){
        console.log(" Skip Activated");
        nextTurn();
    }

    // For Reverse Card
    if(discard.dataset.number == 11){
        console.log(" Reverse Activated");
        flag=!flag;
    }

    // For color Card
    if(discard.dataset.color == 4){
        console.log(" Color Activated");

        if(currentTurn === 3){
            document.getElementById("colorPick").style.display="flex";
            waitingColor=true;
            return;
        }else{
            
            let len = deck[currentTurn].children.length;
            let container=deck[currentTurn];
            let red=0,blue=0,green=0,yellow=0,other=0;
            for(let idx=0;idx < len;idx++){
                let cards=container.children[idx];
                if(cards.dataset.color == 0){
                    red++;
                }else if(cards.dataset.color == 1){
                    blue++;
                }else if(cards.dataset.color == 2){
                    yellow++;
                }else if(cards.dataset.color == 3){
                    green++;
                }else{
                    other++;
                }
            }
            let highest=[
                red,
                blue,
                yellow,
                green,
                other
            ]
            picked=highest.indexOf(Math.max(...highest));
        }
    }

    // For +4 Card
    if(discard.dataset.color == 5){
        console.log(" +4 Activated");

        if(currentTurn === 3){
            document.getElementById("colorPick").style.display="flex";
            waitingColor=true;
            return;
        }else{
            
            let len = deck[currentTurn].children.length;
            let container=deck[currentTurn];
            let red=0,blue=0,green=0,yellow=0,other=0;
            for(let idx=0;idx < len;idx++){
                let cards=container.children[idx];
                if(cards.dataset.color == 0){
                    red++;
                }else if(cards.dataset.color == 1){
                    blue++;
                }else if(cards.dataset.color == 2){
                    yellow++;
                }else if(cards.dataset.color == 3){
                    green++;
                }else{
                    other++;
                }
            }
            let highest=[
                red,
                blue,
                yellow,
                green,
                other
            ]
            picked=highest.indexOf(Math.max(...highest));
        }

        nextTurn();
        drawCards(currentTurn);
        drawCards(currentTurn);
        drawCards(currentTurn);
        drawCards(currentTurn);
    }
    return;
}

// For UNO Button
let unoBtn = document.getElementById("unoBTN");
let updates = document.getElementsByClassName("avatar");
let uno ;
unoBtn.addEventListener("click",()=>{
    unoFunc();
});

// Function for UNO Button
function unoFunc(){
    let winner = updates[currentTurn];
    uno = document.createElement("h1");
    uno.innerText="UNO";
    uno.style.color="yellow";
    uno.style.margin="0%";
    winner.appendChild(uno);
}

// Event Listener for Go Wild Mode
let wild = document.getElementsByClassName("wild");

wild[0].addEventListener("click",()=>{
    classicFun();
})

// Animation for Draw a card from a deck
function animateDraw(){
    const drawRect = document.getElementById("drawDeck").getBoundingClientRect();
    const card = document.createElement("img");

    card.src="./assets/uno_back.jpg";
    card.classList.add("animatedDraw");
    document.body.appendChild(card);

    card.style.position = "fixed";
    card.style.left = drawRect.left+"px";
    card.style.top = drawRect.top+"px";
    card.style.transition = "all 0.5s ease";

    const playRect = deck[currentTurn].getBoundingClientRect();
    setTimeout(()=>{
        card.style.left = playRect.left+"px";
        card.style.top = playRect.top+"px";
    },20);

    setTimeout(() => {
        card.remove();
    }, 550);
}