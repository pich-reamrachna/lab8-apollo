# Lab 8: Apollo

## Round 1

1. **OFF TO SEE THE WIZARD...**
   `Luminary099\THE_LUNAR_LANDING.agc` line 254

2. **SEE IF HE'S LYING**
   `Luminary099\THE_LUNAR_LANDING.agc` line 249

3. **SILLY THING AROUND**
   `Luminary099\THE_LUNAR_LANDING.agc` line 246

4. **NOW LOOK WHERE YOU ENDED UP**
   `Luminary099\THE_LUNAR_LANDING.agc` line 317

5. **TEMPORARY, I HOPE HOPE HOPE**
   `Luminary099\LUNAR_LANDING_GUIDANCE_EQUATIONS.agc` lines 179, 180

6. **NUMERO MYSTERIOSO**
   `Luminary099\LUNAR_LANDING_GUIDANCE_EQUATIONS.agc` line 666

7. **NO ROOM IN THE INN**
   - `Comanche055\WAITLIST.agc` line 339
   - `Luminary099\WAITLIST.agc` line 335

8. **TRASHY LITTLE SUBROUTINES**
   `Luminary099\LUNAR_LANDING_GUIDANCE_EQUATION.agc` line 1375

9. **COME AGAIN SOON**
   `Luminary099\BURN_BABY_BURN--MASTER_IGNITION_ROUTINE.agc` line 925

10. **DO NOT USE GOPROG2 OR ENEMA WITHOUT CONSULTING POOH PEOPLE.**
    `Luminary099\FRESH_START_AND_RESTART.agc` line 353

> **Note:** Luminary999 has a file named Pinball. It's an arcade game but it's actually code for the stroke light of the spacecraft.

---

## Round 2

### 1. OFF TO SEE THE WIZARD...

`Luminary099\THE_LUNAR_LANDING.agc` line 254

**What it does:** `TC POSTJUMP` / `CADR BURNBABY` is the last step of P63, the braking phase of the lunar landing. It makes a one-way jump to `BURNBABY`, the shared routine that counts down to ignition and lights the descent engine. Earlier, P63 set `WHICH` to `P63TABLE`, which is how `BURNBABY` knows it's running the landing burn.

**What gets there:** Nothing calls it directly. P63 runs straight down to it from `P63LM`, in this order: check the guidance platform, work out the ignition time, let the crew do an alignment, turn the spacecraft to the burn attitude, make sure the radar antenna is in position (the "CRANK THE SILLY THING AROUND" lines you have selected), and set up the landing radar. Then it jumps.

**Why the comment:** It's a joke on *The Wizard of Oz* song "We're Off to See the Wizard." The preparations are done, and the program leaves for good to hand control to the routine that does the "magic" of firing the engine. It fits with the file's other jokes, like "DIONYSIAN FLAG WAVING," "SEE IF HE'S LYING" and "NOW LOOK WHERE YOU ENDED UP."

### 2. SEE IF HE'S LYING

`Luminary099\THE_LUNAR_LANDING.agc` line 249

```
P63SPOT3	CA	BIT6		# IS THE LR ANTENNA IN POSITION 1 YET
		EXTEND
		RAND	CHAN33
		EXTEND
		BZF	P63SPOT4	# BRANCH IF ANTENNA ALREADY IN POSITION 1

		CAF	CODE500		# ASTRONAUT:	PLEASE CRANK THE
		TC	BANKCALL	#		SILLY THING AROUND
		CADR	GOPERF1
		TCF	GOTOPOOH	# TERMINATE
		TCF	P63SPOT3	# PROCEED	SEE IF HE'S LYING
```

**What the code does:**

- **The check (lines 239–243):** The computer reads bit 6 of input channel 33 (`RAND CHAN33`). That bit tells it whether the landing radar antenna is in position 1, the position needed for descent. If it is, `BZF` jumps straight to `P63SPOT4` and the crew never sees a request.
- **The request (lines 245–247):** If the antenna isn't in position, the computer shows code 500 through `GOPERF1` ("go perform"), asking the crew to move it. Code 500 means "put the landing radar antenna in position 1." The antenna was moved with a cockpit switch, which is the "CRANK THE SILLY THING AROUND" comment.
- **The crew's answer (lines 248–251):** The return depends on the crew's response. The comments on the next three lines show which line each response returns to:
  - **TERMINATE** → line 248, `GOTOPOOH`, which abandons P63.
  - **PROCEED** → line 249, `TCF P63SPOT3`, which jumps back to the top and checks the antenna again.
  - **ENTER** → line 251, `P63SPOT4`, which goes on to set up the radar.

**Why "SEE IF HE'S LYING":** When the astronaut presses PROCEED, they are in effect saying "done, I moved it." The computer doesn't take their word for it. It goes back to `P63SPOT3` and reads channel 33 again to check the antenna's actual position. If the antenna still isn't in position 1, the same request comes back up. The astronaut can only get past this point once the hardware itself shows position 1 (or by pressing ENTER, which skips the check).

It's the programmers' joke about a simple safety rule: trust the sensor, not the person. It's in the same playful style as "SILLY THING" two lines above.

### 3. NOW LOOK WHERE YOU ENDED UP

`Luminary099\THE_LUNAR_LANDING.agc` line 317

```
LANDJUNK	TC	PHASCHNG
		...
		EXIT
		CAF	V06N43*		# ASTRONAUT:  NOW LOOK WHERE YOU ENDED UP
		TC	BANKCALL
		CADR	GOFLASH
		TCF	GOTOPOOH	# TERMINATE
		TCF	+2		# PROCEED
		TCF	-5		# RECYCLE
```

**What happens before it (lines 286–316):** The LM is now sitting on the Moon, so `LANDJUNK` switches the computer over to "on the surface" mode:

- It zeroes the attitude error and sets a wide 5° deadband (`ZATTEROR`, `SETMAXDB`), so the thrusters don't fire to hold attitude while the LM sits on the ground.
- It sets `SURFFLAG` (on the surface), clears `LETABORT` (a descent abort no longer makes sense) and sets `APSFLAG`. From here on, any departure would use the ascent engine.
- It calls `LAT-LONG` to turn the current position into latitude, longitude and altitude. It also stores the landing site in Moon-fixed coordinates as `RLS` (via `R-TO-RP`). That's where the LM actually is, not where it was aimed.

**What line 317 does:** It loads verb/noun 06 43 (`V06N43*`, defined at line 334 as `VN 0643`). That is a decimal display of noun 43, which holds latitude, longitude and altitude. `GOFLASH` shows it flashing on the DSKY (the crew's display and keypad) and waits for the crew. As with the code-500 request, the comments show where each answer returns to:

- **TERMINATE** → `GOTOPOOH`, which ends P68.
- **PROCEED** → `TCF +2`, which skips the next instruction and goes on to line 324. There, the computer sets up the starting values for P57, the lunar-surface alignment program, then exits. The comment at line 332 says "PLEASE SELECT P57".
- **RECYCLE** → `TCF -5`, which goes back to line 317 and shows the position again.

**Why "NOW LOOK WHERE YOU ENDED UP":** It's the computer's tongue-in-cheek remark at the moment of landing: "Here are your coordinates, see where you actually came down." The descent could leave the LM some distance from the planned site, and the crew could steer by hand near the end. So the first thing the computer does on the surface is show them where they actually are.

On Apollo 11 this turned out to be fitting. Armstrong flew past the planned spot under manual control to avoid a boulder field. According to the file header, though, the code was assembled on July 14, 1969, before the flight. So the joke wasn't written about that landing, it just happened to fit it. It's the same style as "OFF TO SEE THE WIZARD" and "SEE IF HE'S LYING."

---

## Round 3

The antenna-check loop at `THE_LUNAR_LANDING.agc:239-255` (`P63SPOT3` through `P63SPOT4`). That includes the "CRANK THE SILLY THING AROUND" request and the three ways the crew can answer it.

The file for this rewritten login is in [`p63-antenna-check.mjs`](p63-antenna-check.mjs).
