// P63 landing-radar antenna check, rewritten from
// Apollo-11/Luminary099/THE_LUNAR_LANDING.agc, lines 239-255 (P63SPOT3 / P63SPOT4).
// The ALL CAPS comments are the original AGC comments, word for word.

const BIT6 = 0o40; // CHAN33 bit 6: 0 = LR antenna in position 1
const CODE500 = 0o500; // DSKY "please perform" code: put LR antenna in position 1

/**
 * Loops until the landing radar antenna is in position 1, then starts the burn.
 *
 * The hardware and crew are passed in so the logic can run outside the AGC:
 *   readChannel33()      -> current bits of input channel 33
 *   goPerform(code)      -> shows the request, resolves to "TERMINATE" | "PROCEED" | "ENTER"
 *   setPos1()            -> SETPOS1, initializes the landing radar
 *   goToPooh()           -> GOTOPOOH, abandons the program
 *   burnBaby()           -> BURNBABY, the burn executive (one-way handoff)
 */
export async function p63AntennaCheck({ readChannel33, goPerform, setPos1, goToPooh, burnBaby }) {
  // P63SPOT3
  while (true) {
    // IS THE LR ANTENNA IN POSITION 1 YET
    const antennaBit = readChannel33() & BIT6;

    if (antennaBit === 0) {
      // BRANCH IF ANTENNA ALREADY IN POSITION 1
      break;
    }

    // ASTRONAUT:	PLEASE CRANK THE
    //		SILLY THING AROUND
    const response = await goPerform(CODE500);

    if (response === "TERMINATE") {
      // TERMINATE
      return goToPooh();
    }

    if (response === "PROCEED") {
      // PROCEED	SEE IF HE'S LYING
      continue;
    }

    // ENTER falls through to P63SPOT4 without re-checking the antenna.
    break;
  }

  // P63SPOT4
  // ENTER		INITIALIZE LANDING RADAR
  await setPos1();

  // OFF TO SEE THE WIZARD...
  return burnBaby();
}
