document.addEventListener('DOMContentLoaded', () => {
  const squareList = document.querySelectorAll('.grid div');
  const resultDisplay = document.querySelector('#result');
  let width = 15;
  let currentShooterIndex = 202;
  let currentInvaderIndex = 0;

  let alienInvadesTakenDown = [];
  let result = 0;
  let direction = 1;
  let invaderId;

  // define the alien invaders
  const alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39
  ];

  // draw the alien invaders
  alienInvaders.forEach(invaderIndex => {
    squareList[currentInvaderIndex + invaderIndex].classList.add("invader")
  });

  // draw the shooter
  squareList[currentShooterIndex].classList.add("shooter");

  // move the shooter along a line

  function moveShooter(e) {
    squareList[currentShooterIndex].classList.remove("shooter")

    switch (e.keyCode) {
      // Left Arrow
      case 37:
        if (currentShooterIndex % width !== 0) {
          currentShooterIndex -= 1;
        }
        break;

      // Right Arrow
      case 39:
        if (currentShooterIndex % width < (width - 1)) {
          currentShooterIndex += 1;
        }
        break;
    }

    squareList[currentShooterIndex].classList.add("shooter");
  }

  document.addEventListener("keydown", moveShooter);

  // move the alien invaders
  function moveInvaders() {
    const hasNearLeftEdge = alienInvaders[0] % width === 0
    const hasNearRightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;

    if ((hasNearLeftEdge && direction === -1) || (hasNearRightEdge && direction === 1)) {
      direction = width;
    } else if (direction === width) {
      direction = hasNearLeftEdge ? 1 : -1;
    }


    alienInvaders.forEach(invaderIndex => { squareList[invaderIndex].classList.remove("invader") })
    alienInvaders.forEach((_, i) => { alienInvaders[i] += direction });
    alienInvaders.forEach((invaderIndex, i) => {
      if (!alienInvadesTakenDown.includes(i)) {
        squareList[invaderIndex].classList.add("invader");
      }
    });

    // Game Over State
    if (squareList[currentShooterIndex].classList.contains("invader", "shooter")) {
      resultDisplay.textContent = "Game Over";

      squareList[currentShooterIndex].classList.add("boom");
      clearInterval(invaderId)
    }

    alienInvaders.forEach(invaderIndex => {
      if(invaderIndex > (squareList.length - (width - 1))) {
        resultDisplay.textContent = "Game Over";
        clearInterval(invaderId);
      }
    });

    // Win State
    if (alienInvadesTakenDown.length === alienInvaders.length) {
      resultDisplay.textContent = "You Win";

      clearInterval(invaderId);
    }
  }

  // Move Invaders Every 0.5 sec
  invaderId = setInterval(moveInvaders, 500);


  // shoow at aliens
  function shoot(e) {
    let laserId;
    let currentLaserIndex = currentShooterIndex;
  
    function moveLaser() {
      squareList[currentLaserIndex].classList.remove("laser")

      currentLaserIndex -= width
      squareList[currentLaserIndex].classList.add("laser")

      if (squareList[currentLaserIndex].classList.contains("invader")) {
        squareList[currentLaserIndex].classList.remove("laser")
        squareList[currentLaserIndex].classList.remove("invader")
        squareList[currentLaserIndex].classList.add("boom")


        setTimeout(() => squareList[currentLaserIndex].classList.remove("boom"), 250)
        clearInterval(laserId)

        const alienTakenDown = alienInvaders.indexOf(currentLaserIndex)
        alienInvadesTakenDown.push(alienTakenDown);
        result++;
        resultDisplay.textContent = result;
      }

      if (currentLaserIndex < width) {
        clearInterval(laserId)
        setTimeout(() => squareList[currentLaserIndex].classList.remove("laser"), 100)
      }
    }
    if (e.keyCode === 32) {
      laserId = setInterval(moveLaser, 100)
    }
  }

  document.addEventListener("keyup", shoot);
});
