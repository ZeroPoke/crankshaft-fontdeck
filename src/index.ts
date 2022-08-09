import { SMM } from '@crankshaft/types';

export const load = async (smm: SMM) => {
	console.info('FontDeck Loading...');

	var fontname = LoadFont();

	InjectFontDeck(await fontname);

	if (smm.entry === 'library') {
		BuildUI();
	}
};

export const unload = (smm: SMM) => {
	document.getElementById("FontDeck")?.remove();
	document.getElementById("FontDeck-Panel")?.remove();
	document.getElementById("FontDeck-Panel")?.remove();

	if (smm.entry === 'library') {
		smm.MenuManager.removeMenuItem('fontdeck');
	}

	console.info('...FontDeck unloaded!');

};

async function SaveFont(Name: String) {
	await smm.Store.set('fontdeck', 'fontname', Name);
	//await smm.Store.set('fontdeck', 'fonturl', URL);
}

async function LoadFont() {
	const fontname = await smm.Store.get('fontdeck', 'fontname');
	//const fonturl = await smm.Store.get('fontdeck', 'fonturl');
	return fontname;
}

function InjectFontDeck(Name: string) {
	if (!Name) {
		return;
	}
	// create a style element
	var fontstyle = document.createElement('style');
	fontstyle.setAttribute("id", "FontDeck");

	// add the CSS as a string
	fontstyle.innerHTML = `
		@font-face {
			font-family: ${Name};
			src: url("${BuiltinFonts[Name]}");
		}			
		* {
			font-family: ${Name} !important;
		}
		`;

	// add it to the head
	document.getElementsByTagName('head')[0].appendChild(fontstyle);
};

function BuildUI() {
	smm.MenuManager.addMenuItem({
			id: 'fontdeck',
			label: 'FontDeck',
			render: async (smm: SMM, root: HTMLElement) => {
		// create a style element
			const fdpanel = document.createElement('div');
			fdpanel.setAttribute("id", "FontDeck-Panel");

			const fdpanelstyle = document.createElement('style');
			fdpanelstyle.setAttribute("id", "FontDeck-Panel");
		
			// add the CSS as a string
			for (var key in BuiltinFonts) {
				//console.info("key " + key + " has value " + BuiltinFonts[key]);
				fdpanelstyle.innerHTML += `
				@font-face {
					font-family: ${key};
					src: url("${BuiltinFonts[key]}");
				}`
			}

			fdpanelstyle.innerHTML += `
				#FontDeck-Panel {
					width: 90%;
					margin: 0 auto;
					display: block;
					text-align: center;
				}

				p {
					text-align: left;
				}

				h3 {
					margin: 5px;
					text-align: left;
					display: inline-block;
					float: left;

				}

				.csfd-button {
					float: right;
					width: fit-content;
					background-color: #1a9fff;
					color: white;
					text-transform: uppercase;
					cursor: pointer;
					padding: 6px 12px;
					border-width: initial;
					border-style: none;
					border-color: initial;
					border-image: initial;
					border-radius: 2px;
					transition: all 300ms ease 0s;
					justify-content:flex-end;
				}
				`; 
		
			// add it to the head
			document.getElementsByTagName('head')[0].appendChild(fdpanelstyle);

			// Builds the Lists for all non Default fonts.
			var SelectOptions = "";

			for (var key in BuiltinFonts) {
				SelectOptions +=`
				<li data-cs-gp-in-group="root" data-cs-gp-group="Font`+key+`" style="display: block; width: 100%; background-color: rgba(255, 255, 255, 0.05); padding: 8px 0px; margin-bottom: 12px;">
						<div style="display: flex; flex-direction: column; margin: 4px 12px;">
							<div id="main">
								<h3 STYLE="font-family: `+key+` !important;" style="margin: 0px;">`+key+`</h3> 
								<button class="csfd-button" id="`+key+`" data-cs-gp-in-group="Font`+key+`" data-cs-gp-item="Font`+key+`-btn">Select and Reload</button>
							</div>
						<p STYLE="font-family: `+key+` !important;" style="margin: 0px 0px 0px;">`+randomPangrams()+"  "+randomPangrams()+"  "+randomPangrams()+`</p>
						
					</div>
				</li>
				`;
				//console.info("key " + key + " has value " + BuiltinFonts[key]);
			}

		// Default List Item, Plus Processed Lists Items
		fdpanel.innerHTML = `
			<h2 style="text-align: left;">FontDeck</h2>
			<div id="wrapper">
			<ul style="list-style: none; margin: 0px; padding: 0px;">
			<li data-cs-gp-in-group="root" data-cs-gp-group="FontDefault" data-cs-gp-init-focus="true" style="display: block; width: 100%; background-color: rgba(255, 255, 255, 0.05); padding: 8px 0px; margin-bottom: 12px;">
				<div style="display: flex; flex-direction: column; margin: 4px 12px;">
					<div id="main">
						<h3 STYLE="font-family: Motiva !important;" style="margin: 0px;">Default Steam OS</h3>
						<button class="csfd-button" id="Default" data-cs-gp-in-group="FontDefault" data-cs-gp-item="FontDefault-btn">Select and Reload</button>
					</div>
					<p STYLE="font-family: Motiva !important;" style="margin: 0px 0px 0px;">`+randomPangrams()+"  "+randomPangrams()+"  "+randomPangrams()+`</p>

				</div>
			</li>
			`+SelectOptions+`
			</ul>
			</div>
		`;
		// Injects Lists into Manage Panel
		root.appendChild(fdpanel);

		//Does the stuff to make all the buttons click and send the Font names.
		let btns = document.querySelectorAll('button');

		btns.forEach(function (i) {
			i.addEventListener('click', function(event) {
				SaveFont(event.target.id);
				smm.Plugins.reloadPlugin('crankshaft-fontdeck');
			});
		});
		},
	});
}; 

// I thought it'd be fun.
function randomPangrams() {
	return BuiltinPangrams[Math.floor(Math.random()*BuiltinPangrams.length)];
}

// Global Var... GET FUCKED!!!!!!!!!
var BuiltinFonts = 
	{"Comic Mono NF" : "https://rawcdn.githack.com/ZeroPoke/crankshaft-fontdeck/957edbcd428bc133921d054ccaa357cc1918b688/fonts/ComicMonoNF.ttf?raw=true",
	"Acme" : "https://rawcdn.githack.com/ZeroPoke/crankshaft-fontdeck/957edbcd428bc133921d054ccaa357cc1918b688/fonts/Acme-Regular.ttf?raw=true",
	"Akbar" : "https://rawcdn.githack.com/ZeroPoke/crankshaft-fontdeck/957edbcd428bc133921d054ccaa357cc1918b688/fonts/akbar.ttf?raw=true",
	"Assistant" : "https://rawcdn.githack.com/ZeroPoke/crankshaft-fontdeck/957edbcd428bc133921d054ccaa357cc1918b688/fonts/Assistant-VariableFont_wght.ttf?raw=true",
	"Bubblegum Sans" : "https://rawcdn.githack.com/ZeroPoke/crankshaft-fontdeck/957edbcd428bc133921d054ccaa357cc1918b688/fonts/BubblegumSans-Regular.ttf?raw=true",
	"Catamaran" : "https://rawcdn.githack.com/ZeroPoke/crankshaft-fontdeck/957edbcd428bc133921d054ccaa357cc1918b688/fonts/Catamaran-VariableFont_wght.ttf?raw=true",
	"Clarity City" : "https://rawcdn.githack.com/ZeroPoke/crankshaft-fontdeck/957edbcd428bc133921d054ccaa357cc1918b688/fonts/ClarityCity-Regular.ttf?raw=true",
	"Final Frontier Old Style" : "https://rawcdn.githack.com/ZeroPoke/crankshaft-fontdeck/957edbcd428bc133921d054ccaa357cc1918b688/fonts/FINALOLD.TTF?raw=true",
	"Foundation One" : "https://rawcdn.githack.com/ZeroPoke/crankshaft-fontdeck/957edbcd428bc133921d054ccaa357cc1918b688/fonts/FoundationOne.ttf?raw=true",
	"Noto Mono" : "https://rawcdn.githack.com/ZeroPoke/crankshaft-fontdeck/957edbcd428bc133921d054ccaa357cc1918b688/fonts/NotoSansMono-VariableFont_wdth,wght.ttf?raw=true",
	"OpenDyslexic3" : "https://rawcdn.githack.com/ZeroPoke/crankshaft-fontdeck/957edbcd428bc133921d054ccaa357cc1918b688/fonts/OpenDyslexic3-Regular.ttf?raw=true",
	"Pacifico" : "https://rawcdn.githack.com/ZeroPoke/crankshaft-fontdeck/957edbcd428bc133921d054ccaa357cc1918b688/fonts/Pacifico-Regular.ttf?raw=true",
	"Roboto" : "https://rawcdn.githack.com/ZeroPoke/crankshaft-fontdeck/957edbcd428bc133921d054ccaa357cc1918b688/fonts/Roboto-Regular.ttf?raw=true",
	"Savate" : "https://rawcdn.githack.com/ZeroPoke/crankshaft-fontdeck/957edbcd428bc133921d054ccaa357cc1918b688/fonts/savate-regular.otf?raw=true",
	"Twinkle Star" : "https://rawcdn.githack.com/ZeroPoke/crankshaft-fontdeck/957edbcd428bc133921d054ccaa357cc1918b688/fonts/TwinkleStar-Regular.ttf?raw=true",
	"Wander Over Yonder" : "https://rawcdn.githack.com/ZeroPoke/crankshaft-fontdeck/957edbcd428bc133921d054ccaa357cc1918b688/fonts/wander_over_yonder_font.ttf?raw=true",
};

var BuiltinPangrams = 
	[	"The quick brown fox jumps over the lazy dog.",
		"The five boxing wizards jump quickly.",
		"Nymphs blitz quick vex dwarf jog.",
		"DJs flock by when MTV ax quiz prog.",
		"Big fjords vex quick waltz nymph.",
		"Bawds jog, flick quartz, vex nymph.",
		"Waltz job vexed quick frog nymphs.",
		"Junk MTV quiz graced by fox whelps.",
		"Bawds jog, flick quartz, vex nymphs.",
		"Waltz, bad nymph, for quick jigs vex!",
		"Waltz, nymph, for quick jigs vex Bud!",
		"Fox nymphs grab quick-jived waltz.",
		"Brick quiz whangs jumpy veldt fox.",
		"Glib jocks quiz nymph to vex dwarf.",
		"Bright vixens jump; dozy fowl quack.",
		"Vexed nymphs go for quick waltz job.",
		"Quick wafting zephyrs vex bold Jim.",
		"Quick zephyrs blow, vexing daft Jim.",
		"Quick blowing zephyrs vex daft Jim.",
		"Sphinx of black quartz, judge my vow!",
		"Sex-charged fop blew my junk TV quiz.",
		"Both fickle dwarves jinx my pig quiz.",
		"Fat hag dwarves quickly zap jinx mob.",
		"Hick dwarves jam blitzing foxy quip.",
		"Fox dwarves chop my talking quiz job.",
		"Public junk dwarves quiz mighty fox.",
		"Jack fox bids ivy-strewn phlegm quiz.",
		"How quickly daft jumping zebras vex.",
		"Two driven jocks help fax my big quiz.",
		"“Now fax quiz Jack!” my brave ghost pled.",
		"Jack, love my big wad of sphinx quartz!",
		"Do wafting zephyrs quickly vex Jumbo?",
		"Go, lazy fat vixen; be shrewd, jump quick.",
		"Fickle jinx bog dwarves spy math quiz.",
		"Big dwarves heckle my top quiz of jinx.",
		"Fickle bog dwarves jinx empathy quiz.",
		"Public junk dwarves hug my quartz fox.",
		"Jumping hay dwarves flock quartz box.",
		"Five jumping wizards hex bolty quick.",
		"Five hexing wizard bots jump quickly.",
		"Quick fox jumps nightly above wizard.",
		"Vamp fox held quartz duck just by wing.",
		"Five quacking zephyrs jolt my wax bed.",
		"The five boxing wizards jump quickly.",
		"Jackdaws love my big sphinx of quartz.",
		"Show mangled quartz flip vibe exactly.",
		"My jocks box, get hard, unzip, quiver, flow.",
		"Kvetching, flummoxed by job, W. zaps Iraq.",
		"My ex pub quiz crowd gave joyful thanks.",
		"Cozy sphinx waves quart jug of bad milk.",
		"A very bad quack might jinx zippy fowls.",
		"Pack my box with five dozen liquor jugs.",
		"Few quips galvanized the mock jury box.",
		"Quick brown fox jumps over the lazy dog.",
		"Quilt frenzy jackdaw gave them best pox.",
		"Jumpy halfling dwarves pick quartz box.",
		"Schwarzkopf vexed Iraq big-time in July.",
		"Vex quest wizard, judge my backflop hand.",
		"The jay, pig, fox, zebra and my wolves quack!",
		"Blowzy red vixens fight for a quick jump.",
		"Sex prof gives back no quiz with mild joy.",
		"The quick brown fox jumps over a lazy dog.",
		"A quick brown fox jumps over the lazy dog.",
		"Quest judge wizard bonks foxy chimp love.",
		"Boxers had zap of gay jock love, quit women.",
		"Joaquin Phoenix was gazed by MTV for luck.",
		"Quizzical twins proved my hijack-bug fix.",
		"Fix problem quickly with galvanized jets.",
		"The quick brown fox jumps over the lazy dog.",
		"Waxy and quivering, jocks fumble the pizza.",
		"When zombies arrive, quickly fax judge Pat.",
		"Heavy boxes perform quick waltzes and jigs.",
		"A wizard's job is to vex chumps quickly in fog.",
		"Sympathizing would fix Quaker objectives.",
		"Pack my red box with five dozen quality jugs.",
		"BlewJ's computer quiz favored proxy hacking.",
		"Quads of blowzy fjord ignite map vex'd chicks.",
		"Fake bugs put in wax jonquils drive him crazy.",
		"Watch “Jeopardy!”, Alex Trebek's fun TV quiz game.",
		"GQ jock wears vinyl tuxedo for showbiz promo.",
		"The quick brown fox jumped over the lazy dogs.",
		"Who packed five dozen old quart jugs in my box?",
		"Woven silk pyjamas exchanged for blue quartz.",
		"Brawny gods just flocked up to quiz and vex him.",
		"Twelve ziggurats quickly jumped a finch box.",
		"Prating jokers quizzically vexed me with fibs.",
		"My faxed joke won a pager in the cable TV quiz show.",
		"The quick onyx goblin jumps over the lazy dwarf.",
		"The lazy major was fixing Cupid's broken quiver.",
		"Amazingly few discotheques provide jukeboxes.",
		"Jacky can now give six big tips from the old quiz.",
		"Lovak won the squad prize cup for sixty big jumps.",
		"J. Fox made five quick plays to win the big prize.",
		"Foxy diva Jennifer Lopez wasn't baking my quiche.",
		"Cozy lummox gives smart squid who asks for job pen.",
		"By Jove, my quick study of lexicography won a prize.",
		"Levi Lentz packed my bag with six quarts of juice.",
		"Painful zombies quickly watch a jinxed graveyard.",
		"Fax back Jim's Gwyneth Paltrow video quiz.",
		"As quirky joke, chefs won't pay devil magic zebra tax.",
		"My girl wove six dozen plaid jackets before she quit.",
		"Then a cop quizzed Mick Jagger's ex-wives briefly.",
		"Six big devils from Japan quickly forgot how to waltz.",
		"“Who am taking the ebonics quiz?”, the prof jovially axed.",
		"Why shouldn't a quixotic Kazakh vampire jog barefoot?",
		"Grumpy wizards make a toxic brew for the jovial queen.",
		"Sixty zips were quickly picked from the woven jute bag.",
		"Big July earthquakes confound zany experimental vow.",
		"Foxy parsons quiz and cajole the lovably dim wiki-girl.",
		"Cute, kind, jovial, foxy physique, amazing beauty? Wowser!",
		"Have a pick: twenty-six letters — no forcing a jumbled quiz!",
		"A very big box sailed up then whizzed quickly from Japan.",
		"Battle of Thermopylae: Quick javelin grazed wry Xerxes.",
		"Jack quietly moved up front and seized the big ball of wax.",
		"Few black taxis drive up major roads on quiet hazy nights.",
		"Just poets wax boldly as kings and queens march over fuzz.",
		"Bored? Craving a pub quiz fix? Why, just come to the Royal Oak!",
		"Quincy Pondexter blocked five jams against the Wizards!",
		"Crazy Frederick bought many very exquisite opal jewels.",
		"A quivering Texas zombie fought republic linked jewelry.",
		"Grumpy wizards make toxic brew for the evil queen and jack.",
		"The job of waxing linoleum frequently peeves chintzy kids.",
		"Back in June we delivered oxygen equipment of the same size.",
		"Just keep examining every low bid quoted for zinc etchings.",
		"How razorback-jumping frogs can level six piqued gymnasts!",
		"A quick movement of the enemy will jeopardize six gunboats.",
		"All questions asked by five watched experts amaze the judge.",
		"Bobby Klun awarded Jayme sixth place for her very high quiz.",
		"The wizard quickly jinxed the gnomes before they vaporized.",
		"Zelda might fix the job growth plans very quickly on Monday.",
		"Zack Gappow saved the job requirement list for the six boys.",
		"Jackie will budget for the most expensive zoology equipment.",
		"Quirky spud boys can jam after zapping five worthy Polysixes.",
		"Jim quickly realized that the beautiful gowns are expensive.",
	];


