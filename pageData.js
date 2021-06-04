//
//For inserting all page data by using the Sequence 
//and StoryNode constructors and their methods.
//

'use strict'

const credits = new StoryNode();

const egress = new Sequence();
egress.title="egress"
egress.addBatchPage(['The lights of the village crest the hill before me. The glow of dawn caresses the horizon beyond them, and the sight whispers <em>home</em>.',' Already I can feel the warmth of the fires on my skin, the festival glow in the faces of my friends, smell the sweet honey-cakes we save to carry us through the winter. I sigh deeply into the night air, and for the first time since I set foot through the gate of the labyrinth, truly relax.','The twisting walls and passageways of the labyrinth cannot contain anything, only distort that which enters, twist it back around on itself, and bring unto them the unstoppable change which it embodies. I shall traverse that labyrinth again, but for this year, my task is done, and I can allow myself to rest.','I met my quarry in the centre, learned her gaze, contemplated her secrets. What more could I have done? I saw the borders between me and her, saw them dissolve, did my best to keep up with the shifting paradigms.','And here I stand, as a testament to my trial. Here I am still, though different from the woman who entered—and here I stand, on the precipice between the past and future, ready to redefine myself and find my path.'],'next');
egress.addPage('Many turns await me.','Take another step, ever onward')
egress.setNext(credits)

const Altar = new Sequence();
Altar.title="Altar"

const Waiting = new Sequence();
Waiting.title="Waiting"
Waiting.addBatchPage(['The deep, reverberating noice is steady as I approach through this tunnel. Over time, it becomes...not quieter, really, but gentler. It drones on as I enter a cavern at the end of the tunnel—more than tall enough to stand in comfortably, and almost perfectly round, a few paces in diameter.','The walls are covered in faces. Each one is staring, boring into me, where their eyes should be only pits of deepest dark waiting. It\'s as if, in looking upon me, they call for me to look into them, to puzzle out what swirls in their depths.','I reach out, and feel the cheek of one of the faces. Its skin is not smooth like polished stone nor yielding like flesh, but solid, and rough, as if carved with unskilled hands, a facsimile of a face only, a dancer barefoot in the sand, struggling for footing, and the crowd of strangers gathering about her, the ever-shifting faces dancing faster than her feet ever could, the twirling winds brought about not by the waving of her arms, but by the turning of the crowd, and as I push my fingers into the eye sockets and lift the mask off the wall I am driven by fey desire to see her through the eyes of the mass, to know the dancer by the iris of a stranger.','The mask is heavy upon my face but shapes neatly to the curve of my brow, the form of my nose. Like it was made for me. Were these all, made for me? How many faces could I wear?','It is comforting, and warm, but the inside is coated with some thick oily substance which clings to my skin and makes me feel as if I cannot breathe.<br><br>Opening my eyes I see the dancer, and I know there is something inside her which yearns to be free, can see it\'s dream in the way she flinches away from our gaze, in the way she tries to cover herself by dashing her chest against the sand. Where she buries herself I know she has become a cocoon but none can see inside it, none can imagine what may emerge when she is ready.','How could we know her until she chooses to know herself? How could we imagine a person that is not there, superimposed on her flesh? We do because it is all we can do, as we wait, wait patiently for her to emerge. We want her to be free, can\'t wait to see what she\'ll become, but we must be ever so patient as she finds her way.','A sudden lightheadedness overtakes me, and I doff the mask. I find myself lying on the floor in the centre of that chamber, all the faces still staring down at me, waiting.'],'next')
Waiting.addPage('I return the mask, but the ointment which lined it still clings heavy to my face.<br><br>Time to move on.','Leave');
Waiting.addPage('I return the way I came, and the noise does not fade behind me. It is in my bones now, still watching, still waiting.','next')

const Cave = new StoryNode();
Cave.title="Cave"
Cave.setText('Two paths lie before me. One slopes gently downwards, and looking down it I feel a deep thrumming noise reverberating from it. I can\'t tell whether I\'m actually hearing it or only feeling it—it resonates through my body, calling like a dirge. The other passage is level, but the ceiling comes down further in—it might be a squeeze.');
Cave.addOption('Follow the dirge',Waiting);
Cave.addOption('Brave the squeeze',Altar);

Waiting.setNext(Cave);

const enterCave = new Sequence();
enterCave.title="enterCave"
enterCave.addPage('As the ground slopes upward enough to stand, I step carefully forward until I emerge in front of the cave. The ceiling is comfortable enough to stand under, at least for now, and the depth of the cave awaits me.','enter');
enterCave.addBatchPage(['It feels like it\'s unfinished somehow. Like the <span class="labyrinth-color">labyrinth</span> is still approaching its final form, still carving its walls here and the rough stone is only temporary. Like I\'m seeing something private.','And somehow, despite being soaked to the bone, I am warm here. In defiance of the winter beyond the walls of the <span class="labyrinth-color">labyrinth</span> this vast artery is full of warmth. The walls hum with it; pulsating the deepest energies of the <span class="labyrinth-color">labyrinth</span> toward its heart. It seems to me now that the end of my journey is in sight.'],'next');
enterCave.setNext(Cave);

const swimCaveCistern = new Sequence();
swimCaveCistern.title="swimCaveCistern"
swimCaveCistern.addBatchPage(['I turn in the water and begin the rhythmic motions of my arms to pull myself forward, kicking my legs in a frog like manner so as not to disturb the surface of the water with violent splashing. It would feel wrong to make so much noise in this place. After my struggle I want to savour the quiet somewhat.','I learned to swim when I was a child, in a little lake in the hills above the village. My father would take us on warm summer days, and my cousins and I would all play in the water, so joyful and carefree, then dry off in the sun and share a picnic lunch—fresh bread and fruit, not jam but the real thing, ripe and sweet and juicy.<br><br>It\'s been a long time since I\'ve swum. But it feels good to have the water against my skin.'],'next')
swimCaveCistern.setNext(enterCave);

const restWatersCistern = new Sequence();
restWatersCistern.title="restWatersCistern"
restWatersCistern.addPage('It\'s peaceful here, like a womb, and here in the waters at the core of the <span class="labyrinth-color">labyrinth</span> I know I am safe, if only for a time. I\'ve done well to free myself of the sisters of the basin; my apathy, my cowardice, my doubt. They clung to me, but could not drown me. Such a journey does not happen overnight—I know I shall meet them again—but now I am prepared. Knowing them and myself is the only weapon I can have going forward, and it\'s one I\'m glad to have gained, even if it cost the loss of my other tools. The tools of the mind are always more powerful than the tools of the hands; for without the mind being set, and strong, there cannot be any other action.','next');
restWatersCistern.addPage('I feel satisfied to know that I have done this journey to the best of my ability, even if I did falter at times. I trusted myself, and that is more powerful than any magics of protection, divination, or direction.<br><br>But it is time to move on. My journey is not yet over.','Swim towards the cave');
restWatersCistern.setNext(swimCaveCistern);

const freeCisternNode = new StoryNode();
freeCisternNode.title="freeCisternNode"
freeCisternNode.setText('My eyes follow the natural curve of the ceiling and I realize that the cistern is not as vast as it at first seemed. I certainly walked quite a distance on the walkway, but after its end the walls and ceiling slope inward, the columns becoming fewer, until the cistern terminates in a rough stone wall which curves into itself, forming the mouth of a cave.');
freeCisternNode.addOption('Rest in the waters a while longer',restWatersCistern);
freeCisternNode.addOption('Swim towards the cave',swimCaveCistern);

const tools = new Sequence();
tools.title="tools"
tools.addBatchPage(['I sheath my knife and consider my lost cloak and supplies. I wove that cloak myself—weaving was one of the first things my teacher taught me—and embroidered the symbol of the Keeper onto the collar just for this journey. Her cloak is one of the most personal magics a witch has, and the first layer of defense against any force that might harm her. Without it I feel somewhat bare.','My tools are a similar matter—the wand I carved myself when I was first learning direction and control of magic. The act of carving itself, creating the forms one desires from an unformed block of wood, was far more vital than any of the spells I was so eager to cast with it—though I didn\'t realize this at the time. True magic has a way of being more physical, more literal, than many people expect. I can make another. Perhaps it is time to do so, in any case.','The runes I inherited from my teacher, which I believe she came to own in the same way, by her teacher before her. They say the more generations a divining tool has passed through, the more accurate it becomes, guided by the wisdom of the ancestors through whose hands it has passed. Those are a great loss, but not irreplaceable. There are other links to the past, as well as the future. The important thing is not the tool itself but the link it represents.','I\'m glad I still have my knife, which my brother, an apprentice under the town smith, made for me. It will need to be oiled after this swim but there\'s no reason it can\'t continue to serve me well. This too, represents a link—between family, between artist and creation, between giver and receiver. I will continue to carry it with pride.'],'next')
tools.setNext(freeCisternNode)

const freeCistern = new Sequence();
freeCistern.title="freeCistern"
freeCistern.addPage('I did it—I bested them all! I\'m free!<br><br>I feel my chest heave, and race toward the surface. My heartbeat pounds in my waterlogged ears as I break the surface and gulp in the open air. I relax, and breathe deep and slow, then allow myself to drift onto my back and float freely for a moment.','rest')
freeCistern.addBatchPage(['When I look up at the ceiling of the cistern, there are no stars. No drifting lights to surround me, no warmth to reach out for. I am alone. Yet that aloneness does not feel as strange as it once did—I feel that I am beginning to know myself now; that I can choose who I am, can become what I will, whether other see me or not. Their words may bolster me, may inform me, but not define me.<br><br>I am not cold here—the waters which surround me are oddly warm, and I am buoyant in them. I feel safe.'],'next')
freeCistern.setNext(tools);

const drownedEnd = new Sequence();
drownedEnd.title="drownedEnd"
//content tbd

const drownedContinue = new Sequence();
drownedContinue.title="drownedContinue"
drownedContinue.addPage('I drag myself out of the water and force myself to my feet. The mouth of the cave lies open before me.','enter');
drownedContinue.addPage('It feels like it\'s unfinished somehow. Like the <span class="labyrinth-color">labyrinth</span> is still approaching its final form, still carving its walls here and the rough stone is only temporary. Like I\'m seeing something private.','continue');

const drowningNode = new StoryNode();
drowningNode.title="drowningNode"
drowningNode.setText('What do I want? Do I want to perish here in the cold, to suffer no more? If I do, there\'s nothing to stop me. I am alone, and free to choose my end.');
drowningNode.addOption('Go on',drownedContinue);
drowningNode.addOption('End',drownedEnd);

const drowningCistern = new Sequence();
drowningCistern.title="drowningCistern"
drowningCistern.addBatchPage(['Darkness encroaches on the edges of my vision, and I choke as I feel the water take me.','The quiet is absolute.'],'next')
drowningCistern.addPage('','');
//redirect functionality tbd
drowningCistern.addBatchPage(['When I awaken I am not sure if I\'m only dreaming. I am…here, wherever \'here\' is, but my body feels wrong around me. Like I\'m sitting in someone else\'s corpse. I know this must be my body but it still feels wrong, my fingers just a millimetre too long or too short, my boots not fitting quite right, my chest too flat, or my eyes too wide apart. Little gaps in my form, alterations where should be none. I try to banish the feeling but it persists. It is in my bones.','I take stock of my surroundings.<br><br>I am lying on my back on cold hard stone and I am soaking wet. The ground here slopes gently downward to my left, and still water rises to meet it. My left arm and leg are draped into the water, like it just spat me out here, still slick with saliva. I can see far off in the water the columns of the cistern—it seems that I am now in the mouth of a cave, burrowing into the cistern wall.','My bag and all my tools are gone. My cloak, a witch\'s first shield, woven by my own hand, lost to the waters. And my knife, my last tooth, gone too.<br><br>I begin to wonder if I\'ll even last to the end of my journey. Surely this is the end. Surely I can go on no more. Without my cloak I don\'t even carry the mark of Keeper, without my tools how can I call myself a witch? If I am neither then why go on?','<i>That\'s not the point and you know it. This is not a journey for either of those selves. This is a journey for you. It\'s not about sacred duty, or following the steps of your teacher, or the responsibility placed on you by the village, not in the end. It\'s about You. You are the only thing that makes this journey real.</i><br><br>Fuck.'],'next')
drowningCistern.setNext(drowningNode)

const Apathy = new StoryNode();
Apathy.title="Apathy"
Apathy.setText('I twist around in the water and let myself face downward to reach the figure who adhered herself to my legs, then bring my knife down viciously with both hands to meet her heart. When I do, she latches onto my arm in a futile attempt to sink me with her. I let my willpower channel through the cold steel:<br><br>I will not let apathy drown me again. I will fight for the things I care about, and take responsibility for my actions.<br><br>And her power fades—where that lurid blue glow had been, only the black water remains.');

const Cowardice = new StoryNode();
Cowardice.title="Cowardice"
Cowardice.setText('I strike out at the figure who clenched me around the chest, and catch my blade in her side. When I do, her form bursts like a bubble, losing all semblance of human shape, and a malicious wave of shimmering blue surges around my hand then up my arm, pressing tightly from all directions. <i>Shit, she\'s trying to make me drop my knife,</i> I think. But I clench my fist around the handle of my knife, steadfast, and let my resolve emanate from me:<br><br>The time when my cowardice would crush me is over. I will be brave.<br><br>I feel the pressure release, and and the light fades away.');

const Doubt = new StoryNode();
Doubt.title="Doubt"
Doubt.setText('Before I can attack, the figure who had held me by the head speaks once more: <br><i>\"Look at you, poor thing, you\'re already beginning to drown...Your puny knife won\'t have time to reach me before the water fills your—\"</i><br><br>I dive forward and plunge my knife deep into her throat, silencing her. I let the wound speak my will:<br><br>The sirenic whispers of doubt will cloud my mind no more. I will trust myself.<br><br>Her silence is complete as her form crumples, first to a feeble ball of light at the tip of my blade, then to nothing.');

const failApathy = new Sequence(); 
failApathy.title="failApathy"
failApathy.addPage('I twist around in the water and let myself face downward to reach the figure who adhered herself to my legs, then bring my knife down viciously with both hands to meet her heart. When I do, she latches onto my arm in an attempt to sink me with her. My knife finds no purchase in her chest, and I find myself instead fighting once again just to breathe.<br><br>But it\'s too late.','next');
failApathy.setNext(drowningCistern);

const failCowardice = new Sequence();
failCowardice.title="failCowardice"
failCowardice.addPage('I strike out at the figure who clenched me around the chest, and catch my blade in her side. When I do, her form bursts like a bubble, losing all semblance of human shape, and a malicious wave of shimmering blue surges around my hand then up my arm, pressing tightly from all directions. <em>Shit, she\'s trying to make me drop my knife.</em><br><br>I feel a dull pain spread through my knife-arm, and my grip weakens, then releases.','next');
failCowardice.setNext(drowningCistern);

const failDoubt = new Sequence();
failDoubt.title="failDoubt"
failDoubt.addPage('Before I can attack, the figure who had held me by the head speaks once more:<br><i>\"Look at you, poor thing, you\'re already beginning to drown...Your puny knife won\'t have time to reach me before the water fills your lungs. Why did you even come this far? You couldn\'t even run away properly! You should just give up, you useless child.\"</i><br><br>And I hear her. Fuck, I hear every goddamn word.','next');
failDoubt.setNext(drowningCistern);

const Cut = new StoryNode();
Cut.title="Cut"
Cut.setText('I wrench myself free of their grip and draw my knife from my belt.<br><br>They will not best me this time.<br><br>Cut ties with your:');

//append default options for blades nodes
Cut.addOption('Apathy',Apathy);
Cut.addOption('Cowardice',Cowardice);
Cut.addOption('Doubt',Doubt);

Apathy.addOption('Cowardice',Cowardice);
Apathy.addOption('Doubt',Doubt)

Cowardice.addOption('Apathy',Apathy);
Cowardice.addOption('Doubt',Doubt)

Doubt.addOption('Apathy',Apathy);
Doubt.addOption('Cowardice',Cowardice);
//

const Blades = new Sequence();
Blades.title="Blades"
Blades.addBatchPage(['I lean forward with a both hands on the rim of the basin and try to catch my reflection in the surface. The moment I do, the gleaming liquid rises rapidly until it overflows, spilling into the inky black waters of the cistern around me. I leap back in fear.','The glow then rises in a narrow column before me and swirls into a bodily form echoing my own. She sags forward from atop the basin to match my height, her torso convulsing unnaturally in the process. Her featureless face gazes into mine with what seems almost like curiosity—or mockery—as her sisters rise in similar fashion. I turn, and see three glowing, rippling figures now surround me.<br><br>Before I have a chance to react, they reach out in unison, seize me by the neck, and hurl me into the deep. My screams of shock are muffled by the water already forcing its way down my throat. My cloak slips from my shoulders and I lose track of my bag in the tumult.','I struggle for a moment to orient myself, then claw my way forth, breaching the surface as a spluttering, coughing, mess. I clear my drenched hair from my face just enough to see that the glowing figures are now gone, then manage to gulp down a breath of air before my torso and legs are seized and I am dragged below the depths once more.','This time I\'m ready for it, and I do my best to stay calm and hold my breath. My eyes sting like hell when I open them, but I need to know my enemy. One holds my legs, pulling me down with her dead weight. Another hugs me from behind, trying to crush the breath out of my lungs. The last grips her hands tightly around my skull and cranes her neck to whisper softly, sickeningly sweet, in my ear.<br><br>Her drowned voice utters words I know I have heard before:<br><i>\"You don\'t know what you\'re doing. Just give up...Wouldn\'t it be so nice to rest? What reason have you to go on? Sleep here with us, little sister.\"</i>','And in a moment of epiphany, I recognize these three sisters.<br><br>My apathy. My cowardice. My doubt.<br><br>Each a mirror, a facet of me, and each determined to destroy me. They have dogged my steps every moment in this <span class="labyrinth-color">labyrinth</span>, and every moment of my life before I entered. Every choice I\'ve made, they\'ve been there. Whatever formed them—forces from within me or outside me—they have done nothing but dull my tooth, slow my step, drag me down.'],'next');
Blades.setNext(Cut);

const echoesCistern = new Sequence();
echoesCistern.title="echoesCistern"
echoesCistern.addBatchPage(['A vast cistern. It is like nothing I have ever seen. I have heard word of such constructions in far-off cities but never imagined to see such a thing in my life, let alone here.','The walkway itself is submerged just below the surface of the water, such that my every step echoes with a quiet <i>splash</i> and sends a ripple out across the surface of the expanse.','The crests and troughs of each new step overlap with the last to create unendingly unique patterns, mirages, twisted reflections which show not myself but an infinite array of <em>possible</em> selves, each a reply to that before her, iterating toward some final shape which remains unknown but which I know must appear if I take just another step.<br><br>And so I do.<br><br>Onward and onward, I let myself echo out into that inky water, and the question which echoes back is not <i>"Who am I,"</i> nor <i>"Who will I be,"</i> but <i>"Who</i> could <i>I be?"</i> What possibilities lie ahead of me, previously unseen?'],'next');
echoesCistern.addPage('After a time I come to what seems to be the end of the walkway.<br><br>Before me stands a shallow basin, about waist-height and no more than an armspan in diameter. The water it holds glows with otherworldly blue light, like the phosphorescence in which I had been seeing dimly before, but amplified tenfold, and made liquid.','observe your reflection');
echoesCistern.setNext(Blades);

const enterCistern = new Sequence();
enterCistern.title="enterCistern"
enterCistern.addBatchPage(['My entrance into the archway is accompanied by an overwhelming smell of damp. As I proceed, I find that the darkness is not so dark as it was before; I no longer feel lost in a pitch-black void, but rather wrapped in a comforting dark, like a wool blanket pulled over my head.<br><br>More than this, I can see—the world around me glows in a dim blue phosphorescence. It\'s not enough to see more than a few feet in front of me, but nonetheless I find I can go on in this way comfortably enough.','A short flight of stairs leads me down to another arch like the one through which I entered, and beyond which lies a walkway, receding into obscurity, with an endless depth of water below it on all sides. Great stone columns support the ceiling at regular intervals, which continue endlessly into every distance.'],'next')
enterCistern.setNext(echoesCistern);

const fungusCistern = new Sequence();
fungusCistern.title="fungusCistern"
fungusCistern.addPage('No longer wanting to touch the walls, I merely feel out each step gingerly before setting my foot down. This method rewards me when I feel an empty space where the floor should be—a step down—and do <em>not</em> fall like I did at the entrance to the pit. A short flight of stairs leads me down to another archway like the one through which I entered.','gaze beyond');
fungusCistern.addPage('The chamber beyond glistens like moonlight upon the ocean, though the source of the light is unclear. There lies a narrow walkway here which recedes into obscurity, with an endless depth of water below it on all sides, and great stone columns support the ceiling at regular intervals, which continue endlessly into every distance.','enter');
fungusCistern.setNext(echoesCistern);

const fungusHand = new Sequence();
fungusHand.title="fungusHand"
fungusHand.addPage('I shake my hand slightly to dislodge as much of its mass as I can, but don\'t want to stain my cloak with it. Feeling filthy, I carry on.','continue');
fungusHand.setNext(fungusCistern);

const fungusCloak = new Sequence();
fungusCloak.title="fungusCloak"
fungusCloak.addPage('I wipe my arm vigorously with the tail of my cloak. The scratching of the heavy wool on my skin is better than the tickle of that horrible substance, but I don\'t feel any cleaner for the effort.','continue');
fungusCloak.setNext(fungusCistern);

const fungus = new StoryNode();
fungus.title="fungus"
fungus.setText('I walk on, running my hand along the wall for guidance. The walls here a damp with condensation, and cold though apparently not enough to freeze, as though the beating heart of the <span class="labyrinth-color">labyrinth</span> can keep off the winter chill. I stop as my hand strikes something cold and wet and fleshy and is quickly coated in its mass. Recoiling, I tense in disgust as it runs down my arm, dripping quietly upon the floor. It feels all too much like blood, chunky with congealment, but it is anonymous in the darkness.');
fungus.addOption('dirty your cloak',fungusCloak);
fungus.addOption('leave it upon your hand',fungusHand);

const alone = new Sequence();
alone.title="alone"
alone.addPage('I put my hands together around the base of a candle, and reach for that familiar magic. I begin to feel the familiar warmth rising through the soles of my feet—then it splutters, and dies. Clenching my teeth in frustration, I frown, then shut my eyes and try again.<br><br><i>Focus. Come on, <strong>focus.</strong> Fuck.</i>','<em>focus</em>');
alone.addBatchPage(['But nothing comes. My magic has fled me, and I collapse to the wall of the passage, exhausted.<br><br>My feet ache. These are solid boots, but how far have I walked today? The winding passages of the <span class="labyrinth-color">labyrinth</span> could very well compress the journey of many miles within its walls.','When I was young, before my talent for magic was discovered and I was taken in by my teacher, I attended a school with the other children of the village.','One week we went on a trip to the neighbouring town, to join in a summer festival. In our little troupe we sang and laughed and played all the way. Our feet were heavy, but our hearts were light, and the day\'s travel felt like nothing to us. Once there, we stayed in the barn of a farmer who had agreed to take us in for a couple nights. The festival ran its course, and the next morning it came time for us to return.<br><br>On the journey home, however, I did not feel much like joining in the singing nor playing. During the festival I had made some silly mistake, and now felt sure that the other children hated me. So I walked to the back of the pack, feeling quite embarrassed for myself and wanting only to be home and to hug my father again. The deadened impacts of my every footfall exhausted me.'],'next');
alone.addPage('When one has loved ones on their mind, a home to return to, even if they are alone they can travel as though they have warm companionship. It too, is very possible to travel alone when in a group, if one\'s mind is full of doubts and anxieties. And there is nothing more tiring than travelling in such a state.<br><br>I travelled alone that day, as I do tonight.','continue');
alone.setNext(fungus);

const enterScorn = new StoryNode();
enterScorn.title="enterScorn"
enterScorn.setText('I enter, leaving the strange light behind me. My entrance into the archway is accompanied by an overwhelming smell of <i>damp</i>. The dark here is pitch black as rain-wet topsoil, murky and musty and enveloping.');
enterScorn.addOption('light a candle',alone);
enterScorn.addOption('carry on without light',fungus)

const Lights = new Sequence();
Lights.title="Lights"
Lights.addPage('I stand in place and sway gently for a moment, letting the dark music take me. It comes in waves, with no clear origin, and as they wash over me I feel a strange pleasure from somewhere deep within me. Before I know it I am dancing, whirling through the dark like a solar flare lashing out into the void. In this dance I feel myself unraveling, all I once was lost in obscurity. Like a stray thread, pulled and pulled, falling down to reveal something...else. Where I am stripped away a bright core remains, shining through the darkness, something both new and fully me, my heart of hearts beating steadily as if to say: <i>I\'m here. I always have been. Don\'t worry girl, I\'ll always be you.</i>','dance');
Lights.addPage('A light rises on my skin and I see: all the walls are covered in candles, each in their own alcove, gushing forth wax like tears. With each step I take they come to life, their flames dancing with me. And I know that no matter where I go, there is a light within me that I can cultivate. I can burn brighter than the sun, if I let myself dance without fear.','rest');
Lights.addPage('Amidst the bright light, I fall to my knees and rest, drained and energized.','rise');
Lights.addPage('When I awaken, the candles still burn around me, though somewhat dimmer than they seemed in ritual. The luminescent glow of the magic circle has now faded to nothing. The sky far above is still dark, but the cloud cover has cleared, and I can now see distant stars reaching out to me.<br><br>A large archway stands to one side of the ritual chamber.','enter');
Lights.setNext(enterCistern);

const scorn = new Sequence();
scorn.title="scorn"
scorn.addBatchPage(['I can\'t let this place take control of me.','To let the music take me, that terrible dance, would be giving away control over my own soul, and I can\'t stand that. Every step I take must be my own will, my own choice. How could I live freely if fate exists?'],'next');
scorn.addPage('To allow myself to dance would be to let the universe take the reins of my destiny. Who knows what might happen if I let myself loose like that? I don\'t trust my legs to carry me in that dance. Only a firm hand to hold onto my soul, my expression held still whether joyous or depressed.','move on')
scorn.addPage('A large archway stands to one side of the ritual chamber. Darkness prevails inside. The beat I felt has now faded but the circle still glows incessantly.','enter');
scorn.setNext(enterScorn);

const beatRises = new StoryNode();
beatRises.title="beatRises"
beatRises.setText('There is a circle drawn in the centre of the chamber in some phosphorescent medium, about three paces across. Its edges are marked with runes and converging lines whose power I can already feel but whose purpose I cannot discern.<br><br>A beat rises in my bones, its wild rhythm calling me forth to the centre.');
beatRises.addOption('give in to the music',Lights);
beatRises.addOption('still yourself.',scorn);

const pit = new Sequence();
pit.title="pit"
pit.addPage('After a time, I come to a vast void which my light does nothing to pierce. The walls disappear around me such that, for a moment, I worry I\'ve stumbled upon a new egress from the <span class="labyrinth-color">labyrinth</span>—but the silhouette of the far walls of the chamber against the faint glow of the sky assures me otherwise.','next');
pit.addPage('My next step finds empty space where the floor should be and I fall forward, my candle thrown from my hand in the confusion. I feel a splash of hot wax burn my face, and then the light goes out.<br><br>I let the pain leave my body in a startled cry, then take a moment to find myself. I\'m sprawled out on a set of cobbled steps, spiralling down into the darkness.','descend');
pit.addPage('Stepping gingerly at first, needing to feel for the edge of each step with my toe, then more confidently as I find a safe cadence, I follow the steps in their wide arc around the void. Each row is tighter than the last, and after an unmeasurable time I arrive at the base. The night sky is little more than a shadow far, far, above me.','next');
pit.setNext(beatRises);

const Falling = new Sequence();
Falling.title="Falling"
Falling.addPage('I step forward into the void, one foot in front of the other, endlessly, incautious. Where my hand rests upon the wall the skin becomes rough and sore in time, worn from the friction against the stone.','next');
Falling.addPage('It begins to scare me how far I must have walked. I can\'t keep walking endlessly. What the hell\'s the point? If my job\'s to explore the labyrinth, I\'m not exploring anything, now. Not seeing much of anything at all.','Take another step')
Falling.addBatchPage(['My foot finds empty space beneath me, the stability of stone I had grown so used to suddenly torn away. I cry out, and it echoes through the hall or chamber or pit or whatever it is I\'ve come to—but it does not save me from falling.','I\'m tired. I just want to fall forever, just plummet with the wind in my face, waiting for the impact to come that will kill me. And if it doesn\'t?','Well, it doesn\'t. After hours, or seconds, or an eternity, the ground meets me, and I feel my legs impact at an odd angle, then tumble over onto my elbows, head concussing against the cobbles. A shooting pain drives through my bones, bruising at every point, and a sharp ringing dominates my senses.','I don\'t want to get up. ','If I just lie here maybe I could get some fucking rest for once. As long as the shadows surround me and nobody can see me, then why should I care what happens to me? The labyrinth has eyes too, I know, and they see me even through the dark, but when worse comes to worse at least I know it cannot harm me. Not truly. It\'s not as static as many would think, but its certainly not malicious either.','All the labyrinth can do is amplify what already exists, twist it into something new. The pain and emptiness inside is what I\'m afraid of—not the labyrinth outside.','I can feel it amplifying me even now, calling to the deep things inside me. As I lie there I suddenly feel those eyes on me, and it feels altogether strange and powerful, like dreaming and seeing myself in third person.','I\'m broken. I can see the scars laid bare, always could see them, really. They\'re easy to ignore though, easy to hide: the flinch when I\'m touched, the shakiness that bites when I hear a shout, the silence I fear to break. What do I fear? What\'s the worst that could happen if it were to break?<br><br>What could possibly hurt me more than I hurt myself?','With the labyrinth\'s power in my hands, I feel like I could do anything and nothing. I could die. It\'s a powerful thing, that sudden awareness that, in this very moment, one could die.','But I find I don\'t want to die. Not anymore. Not here, not now. There\'s nothing worse than emptiness. I find myself wanting something, anything, to reach out to. If I carry on who knows what I\'ll find? Something new, at least.'],'next')
Falling.addPage('I hold that power, try to house it within me, and as I let that snaking energy of change wash over me and through me I feel my bones crack and mend, let it distort me and twist my flesh until my legs will carry me again. The scars remain, as does the pain, but I am healed for now.','Continue.');
Falling.addPage('I rise, and stumble forth a few steps.','Look up')
Falling.addPage('To my surprise, there is a chamber before me.','next')
Falling.setNext(beatRises);

const darkContemplation = new Sequence();
darkContemplation.title="darkContemplation"
darkContemplation.addBatchPage(['I\'m in no rush now, I suppose. I should finish my task before morning, but now that it\'s dark already, no amount of hurry will bring back the sun. I\'ll be continuing on in the dark either way. It\'s nice to rest my feet, then, if only for a moment.','Leaning back against the labyrinth wall, I wonder what\'s happening in the village right now. Usually the festivities continue to well after midnight, with drinking and feasting on what meagre fare we had saved up to carry us through this last stretch—jams and pound cakes, smoked meat, cheeses, beer. It\'s a jolly time, with ample dancing and singing.','I miss it. I\'m not supposed to, but I do.','I never would have thought that last year would be my final time joining the villagers for the solstice festival. If my teacher hadn\'t passed in the fall, I would be there again, among them, while she explored the labyrinth. But it\'s hardly her fault that I\'m here instead. I cannot blame her—only take her place.','Now, every year I will have to carry out my journey in this labyrinth again, meeting new revelations and dangers, wandering new paths. Until I die. Until I die, and whatever student I take on takes my place in turn.','I hadn\'t thought about taking on a student before, but nonetheless I know that it will be my place. And yet I feel like I still have so much to learn! How could I ever teach another? I shall have to find a way. There always must be another.','All I can do is trust in myself, in what my teacher taught me and what I\'ve learned on my own, trust in what I have to carry me forward, and then pass on as much as I can.','It\'s a vital task, to know the labyrinth. It is something we have always done. If a time does come when there is no-one to delve within and explore these twisted halls, then it is said the village will be no more.<br><br>And I cannot allow such a thing to transpire.'],'next');
darkContemplation.addPage('I rise once more, feeling focussed on my task, and a little more confident in my step.','continue')
darkContemplation.setNext(pit)

const darkIgnoreBench = new Sequence();
darkIgnoreBench.title="darkIgnoreBench"
darkIgnoreBench.setNext(pit)
//content tbd

const darkBenchNode = new StoryNode();
darkBenchNode.title="darkBenchNode"
darkBenchNode.setText('This seat of contemplation calls to me.');
darkBenchNode.addOption('Sit for a moment',darkContemplation);
darkBenchNode.addOption('Let your feet continue carrying you',darkIgnoreBench);

const darkApproachBench = new Sequence();
darkApproachBench.title="darkApproachBench"
darkApproachBench.addPage('The stone rises to meet me at every footfall, and I soon begin to feel like the labyrinth is doing the walking more than I am.<br><br>It\'s the strangest feeling, to be both in my body, but also above it in a way, as if I\'m watching myself move without making the choice to do so. Or the labyrinth makes the choice for me.','Make her take another step')
darkApproachBench.addBatchPage(['A stone bench, built against the left wall of this passage, emerges out of the darkness. The seat is worn, as if many a person has sat here before, though I know that only the Keeper would have passed here, so deep in the halls of the labyrinth.',' Is it possible that every Keeper before me rested here? Passed through this exact spot? I suddenly don\'t feel so alone in my journey. I\'m alone now, but I\'m far from the only one to travel this path of exploration and doubt. Others have been here before.'],'next');
darkApproachBench.setNext(darkBenchNode);

const darkAnotherCandle = new Sequence();
darkAnotherCandle.title="darkAnotherCandle"
darkAnotherCandle.addPage('Pocketing the burnt-out stub, I bring out a fresh candle, and light my way once more.','Continue')
darkAnotherCandle.setNext(darkApproachBench)

const darkDescendTree = new StoryNode();
darkDescendTree.title="darkDescendTree"
darkDescendTree.setText('I leave, not sure what to think. I descend the wall in much the same manner as before and reach the bottom safely. When I do, I see that my candle has burned out. Thankfully, I have another few in my bag.');
darkDescendTree.addOption('Carry on in the dark',Falling);
darkDescendTree.addOption('Light another candle',darkAnotherCandle);

const crowTurns = new Sequence();
crowTurns.title="crowTurns"
crowTurns.addBatchPage(['The crow turns away, preening its feathers, seeming satisfied with itself. It is silent. Perhaps it would have said such things, if it had spoken—or perhaps it did speak, but only in signs, in gaze and gesture, in feather and beak, in imagination, in silence.','I realize I\'m staring, and it side-eyes me, nestling its head into its feathers to sleep.'],'next');
crowTurns.addPage('The stars begin to reveal themselves through gaps in the cloud overhead. I sit for a moment, watching them.','Descend the tree');
crowTurns.setNext(darkDescendTree)

const crow_1_3 = new Sequence();
crow_1_3.title="crow_1_3"
crow_1_3.addPage('<i>Perhaps you\'re right. But if so, what do I do?<br><span class="crow-color">You keep moving. You think, you stay attentive. You rest when you need.</span><br>Is that enough?<br><span class="crow-color">What else could you do?</span></i>','next')
crow_1_3.setNext(crowTurns)

const crow_1_2_b = new Sequence();
crow_1_2_b.title="crow_1_2_b"
crow_1_2_b.addPage('<i>Even so...<br><span class="crow-color">You\'re here—that\'s enough. You\'ll find your way in time. I\'m not worried about you.</span></i>','next')
crow_1_2_b.setNext(crowTurns)

const crow_1_2_a_2 = new Sequence();
crow_1_2_a_2.title="crow_1_2_a_2"
crow_1_2_a_2.addPage('<i>But I need direction, at least, don\'t I?!<br><span class="crow-color">You came this far without it. Perhaps you\'ll find it along the way, perhaps not—either way, you will go further.</span></i>','next')
crow_1_2_a_2.setNext(crowTurns)

const crow_1_2_a_1 = new Sequence();
crow_1_2_a_1.title="crow_1_2_a_1"
crow_1_2_a_1.addPage('<i><span class="crow-color">It is not the witch\'s job to know, little one—simply to be open to the truth. Be patient, and you will find your way.</span></i>','next')
crow_1_2_a_1.setNext(crowTurns)

const crow_1_2_a = new StoryNode();
crow_1_2_a.title="crow_1_2_a"
crow_1_2_a.setText('<i>But <em>I</em> need to! A witch\'s work centres around knowing.<br><span class="crow-color">No one can know all.</span></i>')
crow_1_2_a.addOption('<i>~listen~</i>',crow_1_2_a_1)
crow_1_2_a.addOption('<i>~interrupt~ But I need direction, at least, don\'t I?!</i>',crow_1_2_a_2)

const crow_1_2 = new StoryNode();
crow_1_2.title="crow_1_2"
crow_1_2.setText('<i>Don\'t I? Not much of a witch if I don\'t know my work.<br><span class="crow-color">Few do. Fewer still do it.</span></i>')
crow_1_2.addOption('<i>But <em>I</em> need to! A witch\'s work centres around knowing</i>',crow_1_2_a)
crow_1_2.addOption('<i>~hesitate~ Even so...</i>',crow_1_2_b)

const crow_1_1 = new Sequence();
crow_1_1.title="crow_1_1"
crow_1_1.addPage('<i>I feel as though I should. I feel very lost, without knowing.<br><span class="crow-color">We\'re all lost. But your feet will find the way if you trust them.</span></i>','next')
crow_1_1.setNext(crowTurns)

const crow_1 = new StoryNode();
crow_1.title="crow_1"
crow_1.setText('<i>I…I\'m not sure.<br><span class="crow-color">Only stone is sure. Even then, it crumbles. You do not need to know.</span></i>')
crow_1.addOption('<i>I feel as though I should. I feel very lost, without knowing.</i>',crow_1_1)
crow_1.addOption('<i>Don\'t I? Not much of a witch if I don\'t know my work.</i>',crow_1_2)
crow_1.addOption('<i>Perhaps you\'re right. But if so, what do I do?</i>',crow_1_3)

const crow_2_2 = new Sequence();
crow_2_2.title="crow_2_2"
crow_2_2.addPage('<i>What is, then?<br><span class="crow-color">It is your task to be changed, little one.</span></i>','next')
crow_2_2.setNext(crowTurns)

const crow_2_1_b_1 = new Sequence();
crow_2_1_b_1.title="crow_2_1_b_1"
crow_2_1_b_1.addPage('<i>Perhaps I mustn\'t—but I would rather be irreplaceable enough to have purpose.<br><span class="crow-color">Ah~ Then I can tell you one way in which you are: In that you are young. Very rarely does one get the opportunity to be young. It follows, therefore, that you can grow. Like any young thing upon the soil you have the chance to find your own way to the sun.</span></i>','next')
crow_2_1_b_1.setNext(crowTurns)

const crow_2_1_b_2 = new Sequence();
crow_2_1_b_2.title="crow_2_1_b_2"
crow_2_1_b_2.addPage('<i>It may be—but what my story is, I do not know.<br><span class="crow-color">In time you will see the signals and the signs, the soaring arias of each theme, the chorus singing out each triumph and failure, each romance and tragedy. Without a doubt, your story is the grandest there ever was, for it is every tale wrapped up in one. That is what it is to be human.</span></i>','next')
crow_2_1_b_2.setNext(crowTurns)

const crow_2_1_b = new StoryNode();
crow_2_1_b.title="crow_2_1_b"
crow_2_1_b.setText('<i>How am I, then? Special?<br><span class="crow-color">Must you be special? Is it not a great privilege to have something in common with everything else in the universe? Is it not a great comfort to know that your story has been told before?</span></i>')
crow_2_1_b.addOption('<i>Perhaps I mustn\'t—but I would rather be irreplaceable enough to have purpose.</i>',crow_2_1_b_1)
crow_2_1_b.addOption('<i>It may be—but what my story is, I do not know.</i>',crow_2_1_b_2)

const crow_2_1_a_3 = new Sequence();
crow_2_1_a_3.title="crow_2_1_a_3"
crow_2_1_a_3.addPage('<i>Then tell me!<br><span class="crow-color">Your desperate need to know is heartening. Not all have that drive—fewer still are strong enough to voice it. Your reason for being here is just that: to ask that question. Someone needs to, after all.</span></i>','next')
crow_2_1_a_3.setNext(crowTurns)

const crow_2_1_a_2_2 = new Sequence();
crow_2_1_a_2_2.title="crow_2_1_a_2_2"
crow_2_1_a_2_2.addPage('<i>Please. Tell me. I don\'t know what to do on my own.<br><span class="crow-color">Aha. It takes strength to admit that: You just fulfilled it, your purpose, a little bit.</span><br>What?<br><span class="crow-color">Change, little one. Change.</span></i>','next')
crow_2_1_a_2_2.setNext(crowTurns)

const crow_2_1_a_2_1_b = new Sequence();
crow_2_1_a_2_1_b.title="crow_2_1_a_2_1_b"
crow_2_1_a_2_1_b.addPage('<i>No. I don\'t need to know.<br><span class="crow-color">Very well. It\'s all the same to me—travel in lightness, little one.</span></i>','next')
crow_2_1_a_2_1_b.setNext(crowTurns)

const crow_2_1_a_2_1_a = new Sequence();
crow_2_1_a_2_1_a.title="crow_2_1_a_2_1_a"
crow_2_1_a_2_1_a.addPage('<i>Yes, please.<br><span class="crow-color">You are special in that you are here—the wind passes through airily, the stone merely waits for you, but you: you are real when you are here. And you can change.</span></i>','next')
crow_2_1_a_2_1_a.setNext(crowTurns)

const crow_2_1_a_2_1 = new StoryNode();
crow_2_1_a_2_1.title="crow_2_1_a_2_1"
crow_2_1_a_2_1.setText('<i><span class="crow-color">It\'s natural to be afraid when confronted with that which you don\'t understand—just don\'t take it out on me. Do you want to know, or not?</span></i>')
crow_2_1_a_2_1.addOption('<i>Yes, please.</i>',crow_2_1_a_2_1_a)
crow_2_1_a_2_1.addOption('<i>No. I don\'t need to know.</i>',crow_2_1_a_2_1_b)

const crow_2_1_a_2 = new StoryNode();
crow_2_1_a_2.title="crow_2_1_a_2"
crow_2_1_a_2.setText('<i>I\'m beginning to doubt you even know, bird.<br><span class="crow-color">If you\'re going to be so petulant, I need not tell you.</span></i>')
crow_2_1_a_2.addOption('<i>~be silent~</i>',crow_2_1_a_2_1)
crow_2_1_a_2.addOption('<i>~concede~ Please. Tell me. I don\'t know what to do on my own.</i>',crow_2_1_a_2_2)

const crow_2_1_a_1 = new Sequence();
crow_2_1_a_1.title="crow_2_1_a_1"
crow_2_1_a_1.addPage('<i>I don\'t need to. It\'s the journey that matters.<br><span class="crow-color">Ah! So you do know after all, then! Good.</span></i>','next')
crow_2_1_a_1.setNext(crowTurns)

const crow_2_1_a = new StoryNode();
crow_2_1_a.title="crow_2_1_a"
crow_2_1_a.setText('<i>But I am human. That must stand for something.<br><span class="crow-color">Not for much. Don\'t be arrogant, now. You don\'t even know why you\'re here!</span></i>')
crow_2_1_a.addOption('<i>I don\'t need to. It\'s the journey that matters.</i>',crow_2_1_a_1)
crow_2_1_a.addOption('<i>~insult~ I\'m beginning to doubt you even know, bird.</i>',crow_2_1_a_2)
crow_2_1_a.addOption('<i>~plead~ Then tell me!</i>',crow_2_1_a_3)

const crow_2_1 = new StoryNode();
crow_2_1.title="crow_2_1"
crow_2_1.setText('<i>To see it, then. Wind cannot see.<br><span class="crow-color">Wind <em>can</em> see and stone can listen, little one. You are not special in that regard.</span></i>')
crow_2_1.addOption('<i>But I am human. That must stand for something.</i>',crow_2_1_a)
crow_2_1.addOption('<i>~plead~ How am I, then? Special?</i>',crow_2_1_b)

const crow_2 = new StoryNode();
crow_2.title="crow_2"
crow_2.setText('<i>To pass through these halls and passages.<br><span class="crow-color">Wind can pass through. Spring can pass through. That is not your task.</span></i>')
crow_2.addOption('<i>To see it, then. Wind cannot see.</i>',crow_2_1)
crow_2.addOption('<i>What is, then?</i>',crow_2_2)

const crow_3_2_c = new Sequence();
crow_3_2_c.title="crow_3_2_c"
crow_3_2_c.addPage('<i>I might not find anything.<br><span class="crow-color">There is no fear in being alone, unless you fear yourself. If you treat yourself gently she will have no need to fear you. Go forth with a lighter hand, little one.</span></i>','next')
crow_3_2_c.setNext(crowTurns)

const crow_3_2_b = new Sequence();
crow_3_2_b.title="crow_3_2_b"
crow_3_2_b.addPage('<i>I might find something I cannot help but love.<br><span class="crow-color">Is that so terrible a thing?</span></i>','next')
crow_3_2_b.setNext(crowTurns)

const crow_3_2_a_3 = new Sequence();
crow_3_2_a_3.title="crow_3_2_a_3"
crow_3_2_a_3.addPage('<i>It may <em>be</em> me.<br><span class="crow-color">It seems as though you already know that it will be. In which case, there is no advice I can give you that will mean anything—but at least know that she likely doesn\'t hate you as much as you hate her.</span></i>','next')
crow_3_2_a_3.setNext(crowTurns)

const crow_3_2_a_2 = new Sequence();
crow_3_2_a_2.title="crow_3_2_a_2"
crow_3_2_a_2.addPage('<i>It may be stronger than me.<br><span class="crow-color">In which case it will destroy you, whether you see it or not. But you only have a chance in overcoming it if you see it first.</span></i>','next')
crow_3_2_a_2.setNext(crowTurns)

const crow_3_2_a_1 = new Sequence();
crow_3_2_a_1.title="crow_3_2_a_1"
crow_3_2_a_1.addPage('<i>It may hurt me<br><span class="crow-color">It is good to not take hurt lightly—but do not let pain terrify you. Is it not a proof that you are real? At times, that may be what you need most.</span></i>','next')
crow_3_2_a_1.setNext(crowTurns)

const crow_3_2_a = new StoryNode();
crow_3_2_a.title="crow_3_2_a"
crow_3_2_a.setText('<i>I might find something I hate.<br><span class="crow-color">Would you rather it stalk you in the darkness, unknown and unseen? Why not confront it?</span></i>')
crow_3_2_a.addOption('<i>It may hurt me.</i>',crow_3_2_a_1)
crow_3_2_a.addOption('<i>It may be stronger than me.</i>',crow_3_2_a_2)
crow_3_2_a.addOption('<i>It may <em>be</em> me.</i>',crow_3_2_a_3)

const crow_3_2 = new StoryNode();
crow_3_2.title="crow_3_2"
crow_3_2.setText('<i>Because I am afraid of what I might see.<br><span class="crow-color">We all are, at times. But the universe inevitably calls upon us to see it. What do you fear seeing, if you were to look?</span></i>')
crow_3_2.addOption('<i>I might find something I hate.</i>',crow_3_2_a)
crow_3_2.addOption('<i>I might find something I cannot help but love.</i>',crow_3_2_b)
crow_3_2.addOption('<i>I might not find anything.</i>',crow_3_2_c)

const crow_3_1_b_2 = new Sequence();
crow_3_1_b_2.title="crow_3_1_b_2"
crow_3_1_b_2.addPage('<i>What if I wake up?<br><span class="crow-color">To do so would be to die. There is no world outside the dream. All is illusions. You wake into another dream: the play goes on, the curtain rises again. But what matters is that in that dream, you always see something you\'ve never seen before. You realize that, despite coming from you, it is beyond you. Always a step beyond.</span></i>','next')
crow_3_1_b_2.setNext(crowTurns)

const crow_3_1_b_1 = new Sequence();
crow_3_1_b_1.title="crow_3_1_b_1"
crow_3_1_b_1.addPage('<i>And what comes next?<br><span class="crow-color">Only you can know that. Take another step, and find out.</span></i>','next')
crow_3_1_b_1.setNext(crowTurns)

const crow_3_1_b = new StoryNode();
crow_3_1_b.title="crow_3_1_b"
crow_3_1_b.setText('<i>Where am I, then?</i><br><span class="crow-color">You are here, and now. You are wandering. You are dreaming. You are waiting for what comes next.</span>')
crow_3_1_b.addOption('<i>And what comes next?</i>',crow_3_1_b_1)
crow_3_1_b.addOption('<i>What if I wake up?</i>',crow_3_1_b_2)

const crow_3_1_a_3 = new Sequence();
crow_3_1_a_3.title="crow_3_1_a_3"
crow_3_1_a_3.addPage('<i>Organs?<br><span class="crow-color">Every body must have some organs—a mouth to swallow you, a skin to keep it safe, perhaps wounded, perhaps scabbed, a diseased lung, whose branches look barren in winter, twisting arteries, a heart...</span></i>','next')
crow_3_1_a_3.setNext(crowTurns)

const crow_3_1_a_2 = new Sequence();
crow_3_1_a_2.title="crow_3_1_a_2"
crow_3_1_a_2.addPage('<i>Veins?<br><span class="crow-color">You saw it before, didn\'t you? How the energy of this place all flows to the heart, drawing you along with it? That truth is inescapable.</span></i>','next')
crow_3_1_a_2.setNext(crowTurns)

const crow_3_1_a_1 = new Sequence();
crow_3_1_a_1.title="crow_3_1_a_1"
crow_3_1_a_1.addPage('<i>Blood?<br><span class="crow-color">Certainly not stone. You are not so dead as you seem to believe.</span></i>','next')
crow_3_1_a_1.setNext(crowTurns)

const crow_3_1_a = new StoryNode();
crow_3_1_a.title="crow_3_1_a"
crow_3_1_a.setText('<i>What am I seeing, then?</i><br><span class="crow-color">Look again, and see the blood, the veins, the organs. That\'s what you\'re here for.</span>')
crow_3_1_a.addOption('<i>Blood?</i>',crow_3_1_a_1)
crow_3_1_a.addOption('<i>Veins?</i>',crow_3_1_a_2)
crow_3_1_a.addOption('<i>Organs?</i>',crow_3_1_a_3)

const crow_3_1 = new StoryNode();
crow_3_1.title="crow_3_1"
crow_3_1.setText('<i>Of course I am. I see…the walls, the passages, the chambers.<br><span class="crow-color">Child, the labyrinth is not here. It never was.</span></i>')
crow_3_1.addOption('<i>What am I seeing, then?</i>',crow_3_1_a)
crow_3_1.addOption('<i>Where am I, then?</i>',crow_3_1_b)

const crow_3 = new StoryNode();
crow_3.title="crow_3"
crow_3.setText('<i>To see it, like I said. To find what I can within.<br><span class="crow-color">Then why aren\'t you looking?</span></i>')
crow_3.addOption('<i>.Of course I am. I see…the walls, the passages, the chambers.</i>',crow_3_1)
crow_3.addOption('<i>Because I am afraid of what I might see.</i>',crow_3_2)

const crow_4_2_c_2 = new Sequence();
crow_4_2_c_2.title="crow_4_2_c_2"
crow_4_2_c_2.addPage('<i>I\'m not sure yet. I\'m trying, though.<br><span class="crow-color">Keep trying, then—you\'ll find it eventually. You always do. I wonder what it\'ll be, this time?</span></i>','next')
crow_4_2_c_2.setNext(crowTurns)

const crow_4_2_c_1_2_a = new Sequence();
crow_4_2_c_1_2_a.title="crow_4_2_c_1_2_a"
crow_4_2_c_1_2_a.addPage('<i>Yes.<br><span class="crow-color">Careful, speaking so bravely. Your quarry may elude you yet. No doubt, though; what is deep and true shall remain.</span></i>','next')
crow_4_2_c_1_2_a.setNext(crowTurns)

const crow_4_2_c_1_2_b = new Sequence();
crow_4_2_c_1_2_b.title="crow_4_2_c_1_2_b"
crow_4_2_c_1_2_b.addPage('<i>No.<br><span class="crow-color">Ah. So therein lies your quarry. Very well, then.</span></i>','next')
crow_4_2_c_1_2_b.setNext(crowTurns)

const crow_4_2_c_1_2 = new StoryNode();
crow_4_2_c_1_2.title="crow_4_2_c_1_2"
crow_4_2_c_1_2.setText('<i>About myself, and how others can know themselves too.<br><span class="crow-color">Do you know yourself already?</span></i>')
crow_4_2_c_1_2.addOption('<i>Yes.</i>',crow_4_2_c_1_2_a)
crow_4_2_c_1_2.addOption('<i>No.</i>',crow_4_2_c_1_2_b)

const crow_4_2_c_1_1 = new Sequence();
crow_4_2_c_1_1.title="crow_4_2_c_1_1"
crow_4_2_c_1_1.addPage('<i>About the world, and all that resides within it.<br><span class="crow-color">A powerful thing. There is very much in the world. But you may find in time, that it\'s really you. It\'s all you. Or was. Or will be. Or rather, you are it—the universe, knowing itself, over and over again.</span></i>','next')
crow_4_2_c_1_1.setNext(crowTurns)

const crow_4_2_c_1 = new StoryNode();
crow_4_2_c_1.title="crow_4_2_c_1"
crow_4_2_c_1.setText('<i>A certain kind of knowing, like all witches.<br><span class="crow-color">A knowing? Of what sort?</span></i>')
crow_4_2_c_1.addOption('<i>About the world, and all that resides within it.</i>',crow_4_2_c_1_1)
crow_4_2_c_1.addOption('<i>About myself, and how others can know themselves too.</i>',crow_4_2_c_1_2)

const crow_4_2_c = new StoryNode();
crow_4_2_c.title="crow_4_2_c"
crow_4_2_c.setText('<i>Hunting is about providence. For oneself, for our community.<br><span class="crow-color">What do you provide?</span></i>')
crow_4_2_c.addOption('<i>A certain kind of knowing, like all witches.</i>',crow_4_2_c_1)
crow_4_2_c.addOption('<i>I\'m not sure yet. I\'m trying, though.</i>',crow_4_2_c_2)

const crow_4_2_b_1 = new Sequence();
crow_4_2_b_1.title="crow_4_2_b_1"
crow_4_2_b_1.addPage('<i>A mausoleum of stone, an open casket.<br><span class="crow-color">Remember your teachings, young witch: with every death comes new life. The universe gives and takes in its endless cycle. If this grave takes you, another will arise in your place.</span></i>','next')
crow_4_2_b_1.setNext(crowTurns)

const crow_4_2_b_2 = new Sequence();
crow_4_2_b_2.title="crow_4_2_b_2"
crow_4_2_b_2.addPage('<i>A body lying curled upon the beach, a genesis.<br><span class="crow-color">Every moment is genesis. But for the body on the beach, limbs curling into the walls of this labyrinth, she has been waiting a long time. I\'m sure she\'s glad you\'re here.</span></i>','next')
crow_4_2_b_2.setNext(crowTurns)

const crow_4_2_b_3 = new Sequence();
crow_4_2_b_3.title="crow_4_2_b_3"
crow_4_2_b_3.addPage('<i>Empty twisted halls, waiting in the dark.<br><span class="crow-color">Not so empty, with you here. In fact they wait no longer—with every footfall of yours their destiny is finally served. As it was for the one before you.</span></i>','next')
crow_4_2_b_3.setNext(crowTurns)

const crow_4_2_b = new StoryNode();
crow_4_2_b.title="crow_4_2_b"
crow_4_2_b.setText('<i>Hunters are good at seeing, too.<br><span class="crow-color">And what do you see here?</span></i>')
crow_4_2_b.addOption('<i>A mausoleum of stone, an open casket.</i>',crow_4_2_b_1)
crow_4_2_b.addOption('<i>A body lying curled upon the beach, a genesis.</i>',crow_4_2_b_2)
crow_4_2_b.addOption('<i>Empty twisted halls, waiting in the dark.</i>',crow_4_2_b_3)

const crow_4_2_a_2 = new Sequence();
crow_4_2_a_2.title="crow_4_2_a_2"
crow_4_2_a_2.addPage('<i>No.<br><span class="crow-color">Be wary, then. Such things rarely come when expected—best to live as if you are close, and not regret a thing if it should come.</span></i>','next')
crow_4_2_a_2.setNext(crowTurns)

const crow_4_2_a_1 = new Sequence();
crow_4_2_a_1.title="crow_4_2_a_1"
crow_4_2_a_1.addPage('<i>Yes.<span class="crow-color">You will find that is more true than you know—but it may not be the sort you expect. Death comes of many selves.</span></i>','next')
crow_4_2_a_1.setNext(crowTurns)

const crow_4_2_a = new StoryNode();
crow_4_2_a.title="crow_4_2_a"
crow_4_2_a.setText('<i>Hunters\' work takes them close to death.<br><span class="crow-color">Do you feel you are close to death? </span></i>')
crow_4_2_a.addOption('<i>Yes.</i>',crow_4_2_a_1)
crow_4_2_a.addOption('<i>No.</i>',crow_4_2_a_2)

const crow_4_2 = new StoryNode();
crow_4_2.title="crow_4_2"
crow_4_2.setText('<i>I am, in a way.<br><span class="crow-color">Which way?</span></i>')
crow_4_2.addOption('<i>Hunters\' work takes them close to death.</i>',crow_4_2_a)
crow_4_2.addOption('<i>Hunters are good at seeing, too.</i>',crow_4_2_b)
crow_4_2.addOption('<i>Hunting is about providence. For oneself, for our community.</i>',crow_4_2_c)

const crow_4_1_b_2 = new Sequence();
crow_4_1_b_2.title="crow_4_1_b_2"
crow_4_1_b_2.addPage('<i>Tell me of its forms.<br><span class="crow-color">One could say it is everything. One could say it is nothing. Depends how healthy your self esteem is, I suppose.</span></i>','next')
crow_4_1_b_2.setNext(crowTurns)

const crow_4_1_b_1 = new Sequence();
crow_4_1_b_1.title="crow_4_1_b_1"
crow_4_1_b_1.addPage('<i>Tell me of its names.<br><span class="crow-color">Some name it God, some name it Universe, the All That Is...some call it mother, some call it child, some call it love—but in the end the name that matters most is the one you choose for yourself.</span></i>','next')
crow_4_1_b_1.setNext(crowTurns)

const crow_4_1_b = new StoryNode();
crow_4_1_b.title="crow_4_1_b"
crow_4_1_b.setText('<i>What is it?<br><span class="crow-color">It goes by many names, many forms.</span></i>')
crow_4_1_b.addOption('<i>Tell me of its names.</i>',crow_4_1_b_1)
crow_4_1_b.addOption('<i>Tell me of its forms.</i>',crow_4_1_b_2)

const crow_4_1_a_3 = new Sequence();
crow_4_1_a_3.title="crow_4_1_a_3"
crow_4_1_a_3.addPage('<i>Not afraid. Only curious.<br><span class="crow-color">Very well. But let me tell you: there\'s nothing wrong with being afraid. Whenever it comes, do your best to embrace it. It tells you that you\'re alive—and moreover, that you care about staying that way.</span></i>','next')
crow_4_1_a_3.setNext(crowTurns);

const crow_4_1_a_2 = new Sequence();
crow_4_1_a_2.title="crow_4_1_a_2"
crow_4_1_a_2.addPage('<i>It is—but a part to be avoided.<br><span class="crow-color">No part of life is to be avoided—perhaps it\'s not to be revelled in. But it is real. And you cannot deny that which is real.</span></i>','next')
crow_4_1_a_2.setNext(crowTurns);

const crow_4_1_a_1 = new Sequence();
crow_4_1_a_1.title="crow_4_1_a_1"
crow_4_1_a_1.addPage('<i>I am. I\'m very afraid. I\'ve been hurt before, and don\'t want to be hurt again.<br><span class="crow-color">Future hurts have ways of resembling past hurts. You survived then, didn\'t you? I\'m not worried about you.</span></i>','next')
crow_4_1_a_1.setNext(crowTurns);

const crow_4_1_a = new StoryNode();
crow_4_1_a.title="crow_4_1_a"
crow_4_1_a.setText('<i>Will it hurt me?<br><span class="crow-color">Will it hurt you? What a strange question. Are you afraid of being hurt? Is hurt not a part of life?</span></i>')
crow_4_1_a.addOption('<i>I am. I\'m very afraid. I\'ve been hurt before, and don\'t want to be hurt again.</i>',crow_4_1_a_1)
crow_4_1_a.addOption('<i>It is—but a part to be avoided.</i>',crow_4_1_a_2)
crow_4_1_a.addOption('<i>Not afraid. Only curious.</i>',crow_4_1_a_3)

const crow_4_1 = new StoryNode();
crow_4_1.title="crow_4_1"
crow_4_1.setText('<i>Perhaps I was mistaken.<br><span class="crow-color">Perhaps so—but whether you hunt it or not, no doubt there is something lying in wait for you.</span></i>')
crow_4_1.addOption('<i>Will it hurt me?</i>',crow_4_1_a)
crow_4_1.addOption('<i>What is it?</i>',crow_4_1_b)

const crow_4 = new StoryNode();
crow_4.title="crow_4"
crow_4.setText('<i>I was told of some quarry residing at the centre...<br><span class="crow-color">A quarry? You\'re no hunter.</span></i>')
crow_4.addOption('<i>Perhaps I was mistaken.</i>',crow_4_1)
crow_4.addOption('<i>I am, in a way.</i>',crow_4_2)

const crow = new StoryNode();
crow.title="crow"
crow.setText('The crow tilts its head, as if asking: <i><span class="crow-color">what are you doing here?</span><br>I don\'t know.<br><span class="crow-color">Don\'t you?</span><br>I climbed for a vantage point. But that\'s not what you mean.<br><span class="crow-color">You know what I mean.</span><br>I\'m here to see the labyrinth. I\'m here to do my duty.<br><span class="crow-color">What is your duty?</span></i>')
crow.addOption('<i>I...I\'m not sure.</i>',crow_1)
crow.addOption('<i>To pass through these halls and passages.</i>',crow_2)
crow.addOption('<i>To see it, like I said. To find what I can within.</i>',crow_3)
crow.addOption('<i>I was told of some quarry residing at the centre...</i>',crow_4)

const darkTreeAscent = new Sequence();
darkTreeAscent.title="darkTreeAscent"
darkTreeAscent.addBatchPage(['I place my candle down carefully against the base of the wall.<br><br>Gripping the branch near its base, I carefully search for a foothold. With my toe between a gap in the stones, I raise myself up into the arms of the oak, and climb.','There are cliffs on the north side of the village that I used to climb as a youth—my strength\'s not where it used to be, but despite my struggle the roots of the tree seem eager to have me, and strong. I enjoy the act of it. There\'s something healing about pulling oneself toward the sky, reaching to find someplace higher.','At last I stand atop the wall, one hand still on the trunk of the tree for support. The weak flame of my candle, far below, still illuminates the passage from which I came. As I look out and away towards the rest of the labyrinth, there is little light.However, from this vantage, a faint, ever-present glow seems to rise from the very stones, creating a horizon around me, allowing view of rings of passages spiralling out, curving away into the dark. So many paths. Which ones have I taken? Which ones are the right ones to take, on my journey to the centre?','Try as I might, I cannot fathom the structure of the whole thing.','I stand there in the night, supported by the tree, pondering for a moment.','Then, a form ripples through the night: a crow, dressed in ink. It lights upon a branch near me with silent grace, and looks at me, curious.'],'next')
darkTreeAscent.setNext(crow)

const darkTreeKeepCandle = new Sequence();
darkTreeKeepCandle.title="darkTreeKeepCandle"
darkTreeKeepCandle.addPage('It\'s not worth it. I\'m afraid to let go of my little light—I should get moving, get to the centre as soon as I can. I must be close now.','next')
darkTreeKeepCandle.setNext(darkApproachBench);

const darkTreeClimb = new StoryNode();
darkTreeClimb.title="darkTreeClimb"
darkTreeClimb.setText('I\'ll have to leave my candle if I\'m to attempt the climb—I\'ll need both hands. It\'s starting to get rather small. It may be burnt out soon, or at least I won\'t be able to carry it.');
darkTreeClimb.addOption('Leave the candle and climb',darkTreeAscent);
darkTreeClimb.addOption('Keep the candle and continue',darkTreeKeepCandle);

const darkTreeContinueOn = new Sequence();
darkTreeContinueOn.title="darkTreeContinueOn"
darkTreeContinueOn.addPage('I should keep going before I run out of candlelight. Besides, the climb might be dangerous. What if I fall, and hurt myself?','Move on')
darkTreeContinueOn.setNext(darkApproachBench);

const darkTreeNode = new StoryNode();
darkTreeNode.title="darkTreeNode"
darkTreeNode.setText('Where its roots disturb the stones of the wall, a questing foot might find firm hold.<br><br>The branch which grasped at my face now reaches down like a proffered hand before me.')
darkTreeNode.addOption('Climb the wall',darkTreeClimb);
darkTreeNode.addOption('Continue on',darkTreeContinueOn)

const darkApproachTree = new Sequence();
darkApproachTree.title="darkApproachTree"
darkApproachTree.addPage('This passage winds like a river, undulating left and right, the walls flowing around me as I step forth.<br><br>I realize past a certain point that I\'ve lost track of the silhouette I saw before—the walls are too high around me to discern anything above.','continue')
darkApproachTree.addBatchPage(['Something lashes out from the darkness, scratching my face and tangling in my hair. I feel a sharp and painful tug at my scalp, and a searing pain across my cheek, the skin sensitive in the cool air. I jump, turning rapidly to face whatever it is.','Where the light of my candle catches on it, a pattern spirals outward, like cracks upon a stone crumbling into the sea, lightning paused in mid-air, hovering just at eye level, dizzying in perspective, reaching toward and away from me, twisting and branching at regular intervals which must be geometrically perfect if only viewed from the right angle—but what vantage point could that be, how could the complexity of such a thing be seen all at once, be truly understood?','It\'s a tree, growing over and through the wall of the labyrinth. Its roots curl and grasp around the huge stones, sending it sprawling at odd angles, its branches filling the sky over the passageway.<br><br>I cannot quite tell what type of tree it is in the gloom—oak, perhaps? This must be the towering silhouette I noted before.'],'next')
darkApproachTree.setNext(darkTreeNode);

const darkNoises = new Sequence();
//content tbd

const darkIntersectionLeft = new StoryNode();
darkIntersectionLeft.title = "darkIntersectionLeft"
darkIntersectionLeft.setText('Again I reach an intersection. One path winds away, curving out of sight. Looking off into the distance I see a silhouette against the sky towering over it. The other seems empty at first, but as I stare into it, I see…ripples, waves pulsating out of the darkness, in some yet-unseen pattern.');
darkIntersectionLeft.addOption('Enter the rippling dark',darkNoises);
darkIntersectionLeft.addOption('Follow the curving path',darkApproachTree);

// moth encounter
const mothBurns = new Sequence();
mothBurns.title="mothBurns"
mothBurns.addPage('The moth darts toward my candle, and before I can stop it, buries itself in the flame. Its tiny body shrivels, and in seconds it is naught more than ash, and falls to the ground. The idiom—like a moth to flame—is true then, I suppose.','next');
mothBurns.addPage('What a shame that something so beautiful would ever end. But perhaps to end in a conflagration of light is better than to end alone in the darkness. <i>Rest well, little one.</i>','continue on');
mothBurns.addPage('I continue for a time, my little flame wavering gently with ever step, pushing light into the night. A light that I now know can mean salvation or destruction.','next')
mothBurns.setNext(darkIntersectionLeft);

const mothLands = new Sequence();
mothLands.title="mothLands"
mothLands.addPage('I stop, and raise the pointer finger of my hand not occupied with the candle. Almost as soon as I do, the moth alights upon it. Its tiny feet tickle upon my bare skin.','examine it');
mothLands.addBatchPage(['Its wings are spun from silver thread, with pale brown lines tracing their edges. The whole creature is no larger than my two thumbnails put together. Fluffy white antennae extend out from above its little black eyes, which gaze at me like tiny beads.<br><br>Such a delicate creature. Its beautiful.','It rises, and flutters into the cool air once more.'],'next');
mothLands.setNext(mothBurns);

const mothNode = new StoryNode();
mothNode.title="mothNode"
mothNode.setText('A moth flutters into my little circle of candle-light, and in the stillness I can hear its tiny wings beat the air. It follows me as I continue walking.');
mothNode.addOption('Let it land upon a finger',mothLands);
mothNode.addOption('Ignore it',mothBurns);
//--

const leftDark2 = new Sequence();
leftDark2.title="leftDark2"
leftDark2.addPage('','');
//content tbd
leftDark2.setNext(mothNode);

const leftDark1 = new Sequence();
leftDark1.title="leftDark1"
leftDark1.addPage('','');
leftDark1.setNext(mothNode);
//tbd

const darkWindow = new Sequence();
darkWindow.title="darkWindow"
darkWindow.addPage('','');
//content tbd

const rightDark2 = new Sequence();
rightDark2.title="rightDark2"
rightDark2.addPage('','');
rightDark2.setNext(darkWindow);
//tbd

const rightDark1 = new Sequence();
rightDark1.title="rightDark1"
rightDark1.addPage('','');
rightDark1.setNext(darkWindow);
//tbd

const deadEnd = new StoryNode();
deadEnd.title="deadEnd";
deadEnd.setText('A wall emerges out of the darkness, directly in front of me.');
deadEnd.addOption('Follow it to the left',leftDark2);
deadEnd.addOption('Follow it to the right',rightDark2);

const corpsesContinue = new Sequence();
corpsesContinue.title="corpsesContinue"
//content tbd
corpsesContinue.setNext(deadEnd);

const corpsesLook = new Sequence();
corpsesLook.title="corpsesLook"
corpsesLook.addBatchPage(['Pallid and chalky fragments. Bone.<br><br><i>Oh gods.</i>','I recoil, covering my mouth in horror.<br><br>The hand reaches out from an adjacent passageway, draped across the ground like a sprung trap.'],'next');
//content tbd
corpsesLook.setNext(deadEnd);

const corpses = new StoryNode();
corpses.title="corpses"
corpses.setText('I stumble over something small and round like pebbles. My light isn\'t enough to see quite what it is.');
corpses.addOption('Crouch down for a closer look',corpsesLook);
corpses.addOption('Keep moving',corpsesContinue)

const straightDark1 = new Sequence();
straightDark1.title="straightDark1"
straightDark1.addPage('I relinquish my hold on the wall, and press forward. When I do, I don\'t meet another wall, just empty darkness surrounds me.','push onward')
straightDark1.setNext(corpses);

const darkIntersection1 = new StoryNode();
darkIntersection1.title="darkIntersection1"
darkIntersection1.setText('I come to what seems to be an intersection—I cannot see the far walls, but the wall I\'m following turns off to the right.');
darkIntersection1.addOption('Continue following the wall',rightDark1);
darkIntersection1.addOption('Cross the darkness to the left',leftDark1);
darkIntersection1.addOption('Delve straight ahead',straightDark1);

const candleDark = new Sequence();
candleDark.title="candleDark"
candleDark.addPage('I bring out a candle, and hold it before me. I close my eyes for focus, then summon forth what power I can and breathe it into a flame. When I open my eyes, the candle has burst into life. Having brought no bowl in which to carry it, I have to hold it horizontally—it won\'t burn as long this way, but it\'s the only way to carry the light with me without the hot wax dripping on my hand.<br><br>My little candle\'s light barely stains the darkness around me; but if I stay close to one wall, it\'s enough to go forth.','continue into the dark');
candleDark.setNext(darkIntersection1);

const dark = new StoryNode();
dark.title="dark"
dark.setText('Solid stone brushes against my fingertips. I\'m safe. I take a moment to calm myself, hugging the wall like an old friend.<br><br>Then I remember the candles in my bag and feel a rush of relief. I could bring light here, but if I do, who knows what I would see in this terrible darkness?');
dark.addOption('Light a candle',candleDark);
dark.addOption('Continue on in the dark',Falling);

const dyingLight = new Sequence();
dyingLight.title="dyingLight"
dyingLight.addPage('One footstep runs into another, and soon I find that the light has died around me. Despite having entered at noon the sun must now have set.<br><br>I stand in the pitch dark, suddenly disoriented.','Reach out for a guide');
dyingLight.addPage('With my hands out in front of me I search blindly for a wall, but find nothing. Only empty blackness before me.<br><br>I take another step, and begin to panic. This passageway was no more than a pace across, it must be just beyond reach, I\'m sure—','Stumble further');
dyingLight.setNext(dark);

const approachQuietly = new Sequence();
approachQuietly.title="approachQuietly"
approachQuietly.addPage('I approach, trying not to disturb them.','next')
approachQuietly.setNext();
//content tbd

const getAttention = new Sequence();
getAttention.title="getAttention"
getAttention.addPage('I call out to them—could they be lost? Any of the people from the village would know not to come close to the <span class="labyrinth-color">labyrinth</span>, but an outsider may have been curious and become lost. <br><br>They don\'t seem to hear me, or else they ignore me.','approach')
getAttention.addPage('I approach warily.','next');
//content tbd

const Ignoring = new StoryNode();
Ignoring.title="Ignoring"
Ignoring.setText('I walk some distance into the halls beyond the garden, thoughtless, wandering. My feet carry me forward relentlessly; I find myself trapped in my head, pacing back and forth over the same thoughts. Then I look up, and every thought flees. I freeze.<br><br>There is a figure standing before me, a few paces away, right in the middle of the passage. Their back is to me.');
Ignoring.addOption('Try to get their attention',getAttention);
Ignoring.addOption('Approach them quietly',approachQuietly)

const MoveOnGarden = new Sequence();
MoveOnGarden.title="MoveOnGarden"
MoveOnGarden.addPage('I shake my head, as if to clear it. If the rowan is dead then so what? Everything dies eventually. This dead garden is of no worth to me. I need to reach the center as soon as I can, finish my work, and maybe then I\'ll be able to return to the village before the festivities are over.','Leave');
MoveOnGarden.setNext(Ignoring);

const letRest = new Sequence();
letRest.title="letRest"
letRest.addPage('Death comes for us all eventually. If this is the rowan\'s time, and she has accepted it already, than it is not my place to disturb her.','Next')
letRest.addPage('In the endless cycling of things another rowan shall come,<i><br>another gentle seedling,<br>another profusion of blossoms,<br>another feast for birds,<br>another sowing of seed,<br>another turning of seasons,</i><br>until it too, decays and makes way once more.<br><br>Such is the way of things. This constant state of change is the lifeblood of the universe.','Leave'); 
letRest.setNext(dyingLight);

const Wands = new Sequence();
Wands.title="Wands"
Wands.addBatchPage(['I draw out my wand, pointing the tip at the ground beside me as I pace around the tree, tracing a ritual circle as I do. This sacred area will allow me to focus my energies to cleanse this tree.<br><br>The problem is not the rot—decay is an extant form of life, after all, a wholly necessary part of the cycle allowing life to pass from one form into the next. But for a tree so young to give into it so soon, to not want to wake up come spring, to not want to fight against the dying of the light—is a heartbreaking thing. The only way to continue spreading the beauty of life is to struggle against the inevitability of death. So she needs a helping hand. We all do, at times.','It could be said that wands are for directing, ordering, a very strict thing, but in my hands it shall be more gentle. The rowan does not need to be told what to want, just nudged, encouraged, coaxed in the right direction.','I stand to one side of my ritual circle with the tree in the centre and the rot before me, then raise my wand and point it forth with a light grip. I can feel myself brimming with energy now, magic coursing through my veins like a grassland set ablaze, like the sun in the peak of summer beating weary travellers over the head, like the smith\'s forge shooting sparks with every hammer\'s-blow. I temper this energy, let it be quenched by my calm, \'til what I draw forth from the quenching oil is not the rough, red-hot blade of raw magic, but the refined edge of my own will strengthened by the flames.<br><br>Gods, it\'s powerful. Even in its repose the rowan draws so much energy to this garden. It\'s only right to use some of this power to its own benefit.','I close my eyes, direct the magic forth through my wand, unto the tree and her rot, and cast my spell. Though I\'ve never attempted a ritual like this before, the words spill from my lips unbidden as if I know them already. I speak, almost singing:<br><br><i>Hear me, oh sleeping Rowan, oh tree of magic,<br>Allow yourself not to yield to this decay,<br>For you are yet young, and now is the time to grow strong—<br>When the light of spring touches your tender branches be glad, and more;<br>Know that no matter what, this spring shall come,<br>And the despair of winter shall pass.<br><br>Hear me, oh vast World,<br>Excise this rot and lend this great Rowan my strength.</i>','When I open my eyes, the lesions in the tree\'s bark which had dripped bloody sap now ooze golden ichor instead. It glows in a regular, pulsating, rhythm, leaving shimmering trails where it flows down her trunk and branches. I feel a droplet fall upon my forehead like warm rain and it runs with a tickling sensation, slow and sticky like honey—over my brow, down the bridge of my nose—before falling on my lips. And I see spring in my mind\'s eye, delicate blossoms bursting forth, warmed by sun, birdsong permeating the air—not yet, but that time shall come. And now the rowan seems to await it hopefully.','It is a shame that nobody will be here to see it, but isn\'t there still something beautiful about that regardless? To bloom softly alone, not to impress anyone but just for the sake of it? The tree flowers not because it has to, or even because it wants to. It simply does because that is its way. It will bloom whether anyone sees it or not, and either way it will be sharing its inner light with the world.<br><br>In this way, I see myself in the rowan: I am capable of, and bound to, change, like any other facet of the universe. Who I am is not who I will always be. And when I do—it can be beautiful.'],'Next');
Wands.addPage('Perhaps a lesson which my teacher hoped I would learn once I entered for myself is this; the unstoppable force of the <span class="labyrinth-color">labyrinth</span> to change a person is not something to be fought or avoided but rather accepted. All journeys change us—that is their purpose—and I can already feel how I could be bettered by this one, both as a person and as a witch.<br><br>But not all change is positive. I will have to continue to the centre warily.','Walk onward');
Wands.setNext(dyingLight);

const Rowan = new StoryNode();
Rowan.title="Rowan"
Rowan.setText('It is my duty as a witch to benefit the natural order of the world. But what does that mean here? <br><br>I could listen to the wounded tree\'s wishes, and the fungus\'s will to devour her, and allow her rest and decay. Everything dies eventually, and perhaps this is her time, to make room for new growth. Doubtlessly the ground will be full of her seed, and another will come.<br><br>Or I could expunge the fungus, and use my magic to nudge her forward, to tell that she must still blossom come spring, implore her not to give in to decay, despite how her wounds call her to the void. She is clearly not an old tree and perhaps deserves to live longer.');
Rowan.addOption('Let her rest',letRest);
Rowan.addOption('Give her strength',Wands);

const Approach = new Sequence();
Approach.title="Approach"
Approach.addPage('As I approach I see what must be causing her pain and indolence. A fungus, peppering her skin with bulbous blistery lesions, oozing bloody sap down her bark. How could I fault her for questioning her will to go on? She is wounded.','Next');
Approach.setNext(Rowan);

const GardenNode = new StoryNode();
GardenNode.title="GardenNode"
GardenNode.setText('For now the rowan is silent and seems as if it doesn\'t want to blossom, doesn\'t want to change, or perhaps doesn\'t have the energy to propel itself forward into the light. However brutal and cold it is, there\'s some part of it that wants to stay that way forever, feels no need to move on from its hibernal emptiness. And the worst part is that I know why she feels that way. Even when presented with the opportunity to be better, it\'s so easy, so comfortable to remain how one is, to give up, to scorn change.<br><br>But if this tree were not to blossom come spring it can only be considered dead. When the cold winter winds come there\'s nothing wrong with hibernation, with rest, but the time must come when one wakes up.');
GardenNode.addOption('Move on',MoveOnGarden);
GardenNode.addOption('Approach the rowan',Approach)

const Garden = new Sequence();
Garden.title="Garden"
Garden.addPage('Finally I come to another chamber, clothed in a soaring archway like the antechamber before it.','Enter');
Garden.addBatchPage(['In an instant, I realize what this place is: a garden. The raised beds, constructed with rough stone walls, follow concentric lines around the chamber, three layers deep. A tree—rowan, with its bloody-red berries long since devoured by the winter birds—rises in the centre. The silhouette of its tangled snarl of branches is bleak against the overcast sky. One would be forgiven for thinking it dead, but I can see by the colour of its bark how vitality still flows beneath, merely dormant.','When I close my eyes I can imagine her filling the sky with green and setting out delicate white blossoms, preparing to share her fruits with the world, delivering forth a song of spring.<br><br>But it is a long time until spring.'],'Next');
Garden.setNext(GardenNode)

const BridgeGarden = new Sequence();
BridgeGarden.title="BridgeGarden"
BridgeGarden.addBatchPage(['My footsteps carry me deeper into the <span class="labyrinth-color">labyrinth</span>\'s halls, and with every step I feel a sense of growing unease. Despite being composed of naught but stone, this place does not feel still. Whether reality or hallucination, at times the walls seem to shift and move, to press in on me or bulge out like alveoli taking in breath. It seems to live. Is it growing, too? Forming new paths somewhere deep within? Or perhaps, right in front of me, as I traverse them? In some way every turn creates a new path, every stone only existing as it comes into my view.','As I navigate a nauseating series of passageways—left, right, right, left, straight, left—I wonder about what it is to be alive.<br><br>The very definition of life is antithetical to stagnation. Life is motion—blood pumping, waves crashing, lungs compressing, wind whistling, muscles contracting, predator pouncing, all a part of the great dance of the universe. Decay, too, is life. As one life ends and moves into another form it is part of the life of the world as a whole. If this change from one state to the next is life, then death and birth are the same on different scales. And as long as one part moves, the whole lives.','To live is to change.<br><br>To want to stay the same is, then, not only self-destructive but disruptive to the greater order of the universe. Then why do we crave so dearly that which is comfortable and safe? It is such a careful dance, to balance the desire for comfort and the need for growth.'],'Next');
BridgeGarden.setNext(Garden);

const Pressing = new Sequence();
Pressing.title="Pressing"
Pressing.addBatchPage(['The gap is very narrow, but, determined, I turn to my side and squeeze through.','The stones of the wall lie heavy around me. My breaths are shallow and forced.','It\'s a funny thing to take space for granted.','In all the universe there is so much of it, but here, <em>here</em>, there is so very little.'],'next');
Pressing.addPage('I feel my bag catch on something and stop fast. It is suddenly very warm.','Pull');
Pressing.addBatchPage(['It won\'t budge.','A foreign hand reaches out from the dim light, grasping it tightly.'],'pull harder')
Pressing.addPage('The stone of the wall suddenly feels soft and yielding against my back.','Struggle free from amidst the press and huddle of bodies around you');
Pressing.addPage('The pressure on my chest is too much, and my lungs refuse to dialate. I close my eyes and give one. last. <em>push.</em><br><br>Then stumble free. <em>I\'m <strong>free</strong></em>. I don\'t have to spend another fucking <em>instant</em> within those bleak wa—<br><br>I stand in another corridor, hemmed in by those familiar granite walls. Somehow the gap must not have been to the outside, but—I know what I saw! The hills of my home, undulating on the other side! Beautiful freedom from my divined fate!<br><br>But alas, no. I turn toward the wall through which I just exited, and see that the gap has sealed itself. Healed with no scar.','next');
Pressing.addPage('There is no way to escape my fate. The <span class="labyrinth-color">labyrinth</span> beckons.<br><br>I pick a direction, and begin to walk forth once more.','Continue')
Pressing.setNext(BridgeGarden);

const CarryOnWall = new Sequence();
CarryOnWall.title="CarryOnWall"
CarryOnWall.addPage('I do my best to control my urge to escape. This is my duty, I...I have to do this. A long and terrifying journey lies ahead of me but I will do my best to be resolute.<br><br>I continue down the passageway, leaving that siren-call behind me.','continue');
CarryOnWall.setNext(BridgeGarden);

const LeaveWall = new Sequence();
LeaveWall.title="LeaveWall"
LeaveWall.addPage('It\'s not my place to interfere. If the <span class="labyrinth-color">labyrinth</span> is crumbling then a new era is coming for my people, in which case I must let it come. My job as Keeper is not to twist destiny, or control the powers of the <span class="labyrinth-color">labyrinth</span>. Just to know it. So that is what I\'ll do.<br><br>I continue down the passageway, leaving the wound in the <span class="labyrinth-color">labyrinth</span>\'s wall festering behind me.','continue')
LeaveWall.setNext(BridgeGarden);

const Lines = new Sequence();
Lines.title="Lines"
Lines.addBatchPage(['I draw the chalk from my bag and think for a moment how I want to do this. The ground here is loose, chipped pieces of stone, not good for drawing on, so I begin by sweeping it away with my foot until a smooth layer of stone appears around the base of the wall. Then, I decide to light a candle to bring some power to the area—I set the lit candle on the ground between me and the gap, then kneel before it.<br><br>Now I am ready for ritual. Already I can feel the warmth of magic rising up through the ground.','Channeling my magic through my chalk, first I draw a semicircle, from the wall on one side of the gap to the other, with the gap contained inside and me and the candle outside. Then, I mark the centre of the semicircle with the rune for External/Other/Sundered and my side of the circle with that for Internal/Womb/Contained. Finally, I mark around the boundary with runes of sealing, and of sky—so that my barrier continues upward along the vertical axis of the wall rather than just at the base where it\'s drawn.','I reach out a hand to test my work. Where it meets the air above the circle, a shimmer appears as the space turns solid. I belong to the inside of this boundary for now. I am a part of the universe but also contained unto myself. I can make my own choices here, without outside influence.','I leave the candle burning to give the spell some extra fuel for a while. These tenuous moments when something is first created and crawls between being and unbeing can be difficult. At any moment the idea could slip away like sand, lost before it\'s born, or become twisted from its intentions. It\'ll need the candle to keep it strong.'],'next');
Lines.addPage('Time to go now. The rest of my journey awaits me, hopefully a little safer for the barrier I\'ve now repaired.','continue');
Lines.setNext(BridgeGarden);

const SqueezeWall = new StoryNode();
SqueezeWall.title="SqueezeWall"
SqueezeWall.setText('I can\'t abandon my duty here. It\'s wrong. But—who would know? I\'m the only one to know the <span class="labyrinth-color">labyrinth</span>, if I say the journey was shorter this year, then who could question me? Why should I go on when I don\'t need to?');
SqueezeWall.addOption('abandon your sacred task',Pressing);
SqueezeWall.addOption('control yourself and carry on',CarryOnWall);

const Wall = new StoryNode();
Wall.title="Wall"
Wall.setText('But a repair of the <span class="labyrinth-color">labyrinth</span> walls is unprecedented; how would the villagers react to such tidings? Is it even right for me to attempt to fix it? Perhaps this is a part of the natural lifespan of something much greater than us, and then who would I be to interfere?');
Wall.addOption('leave it alone',LeaveWall);
Wall.addOption('draw the boundary',Lines);
Wall.addOption('squeeze through the gap',SqueezeWall);

const ApproachWall = new Sequence();
ApproachWall.title="ApproachWall"
ApproachWall.addBatchPage(['This passage seems to follow the outer wall, its distinctive curve and the faint breeze giving it away. I walk for quite a ways with no real objects of interest, until I see it; a gap in the wall of the <span class="labyrinth-color">labyrinth</span>.<br><br>It\'s not so large, but wide enough that a person could squeeze through if they really wanted to. This is wrong. There should be no ingress or egress except the main gates. There is great danger here, of the energies of the <span class="labyrinth-color">labyrinth</span> seeping into the outside world where they shouldn\'t be, the space which the walls are to contain being compromised, or of the outside world tainting that within. I can even see the familiar hills rising on the other side.','I can\'t move the stones to seal the gap. With my magic, perhaps, but doing so would drain me totally and I can\'t risk that so early in my journey.','If I can\'t create a physical barrier, perhaps, at least, a metaphysical one? I could use my chalk to mark the space and delineate some sort of boundary here...a temporary fix for sure, but enough for my journey to be successful, and perhaps later I can see about enlisting help to bring new stone.'],'next');
ApproachWall.setNext(Wall);

const WatchingReturn = new Sequence();
WatchingReturn.title="WatchingReturn"
WatchingReturn.addPage('This passageway curves slightly to the left, until it terminates in a dead end. At the base of the wall a colony of mosses and mushrooms thrives.','<span style="color:red;text-decoration-color:red;">Turn back<br><br>Turn back<br><br>Turn back<br><br>Turn back<br><br>Turn back<br><br>Turn back<br><br>Turn back<br><br>Turn back<br><br>Turn back<br><br>Turn back</span>');
WatchingReturn.addPage('I return to the intersection, and the other path lies open ahead of me. Feeling a shiver creep across my skin, I pull my cloak closer around myself to banish the chill.','Continue')
WatchingReturn.setNext(ApproachWall);

const WatchingBlink = new Sequence();
WatchingBlink.title="WatchingBlink"
WatchingBlink.addPage('It blinks.','');
WatchingBlink.addPage('','')
WatchingBlink.setNext(WatchingReturn);

const Watching = new Sequence();
Watching.title="Watching"
Watching.addPage('The stone here has a calcified affect. It crunches softly as I walk forth.','continue');
Watching.addBatchPage(['This passageway curves slightly to the left, until it terminates in a dead end. At the base of the wall a colony of mosses and mushrooms thrives.','There is a small stream of water trickling through a gap between the stones of the wall. The mosses soak up its moisture and have coated much of the wall and floor here.<br><br>There is a faint smell of rot.'],'Look closer');
Watching.addPage('The ground here is lumpy and soft. Where the mushrooms proliferate, I see a flash of something pallid.<br><br>There is an eye staring back at me.','Hold its gaze');
Watching.addPage('<br><br><br><br><br><br><br>','Hold its gaze');
Watching.addPage('<br><br><br><br>','Hold its gaze');
Watching.setNext(WatchingBlink);

const NobodyWall = new StoryNode();
NobodyWall.title="NobodyWall"
NobodyWall.setText('But what about now, with nobody <em>but</em> myself to see me? Who am I in the eyes of the <span class="labyrinth-color">labyrinth</span>? And who will I be, when my work is done?<br><br>I come to another junction.');
NobodyWall.addOption('Left',Watching);
NobodyWall.addOption('Straight',ApproachWall);

const BridgeWall = new Sequence();
BridgeWall.title="BridgeWall"
BridgeWall.addBatchPage(['There is one fundamental difference between what we call a maze and what we call a <span class="labyrinth-color">labyrinth</span>:<br><br>A maze is a puzzle, intended to baffle and confuse, with dead ends and falsehoods.<br><br>Whereas a <span class="labyrinth-color">labyrinth</span> is a journey. A meditation. A <span class="labyrinth-color">labyrinth</span> intends to bring us from one place to another; no matter what comes, there is no risk of becoming truly lost here. But what it does, along the way, like any journey, is change us. One cannot emerge from a <span class="labyrinth-color">labyrinth</span> the same person they were when they entered.<br><br>Who will I be, when my work is done?','Who am I now? Do I even <em>know?</em><br><br>Have I ever?','All I <em>do</em> know now, is that I must do my job. I try to lose myself in my task, focus only on the steady soft impact of each footfall on the stone beneath me, feel the way the leather of my boots creases around my ankle with each bend, dedicate my mind to contemplating the form of the halls through which I have passed so far and those to come.<br><br>But it isn\'t enough.','The great veins of this place stretch out around me such that in my mind the only shape they can take is of a body, it\'s limbs curled around itself as of one in the womb, lying cold upon the shore.<br><br>And when I see this body of the <span class="labyrinth-color">labyrinth</span> in my mind, I see too the vastness within, and my position not level upon the hard ground but rather drifting, floating, and there is no ground, nor walls nor sky; I am surrounded only by burning points of light which dance and flicker around me in the dark.','I reach out to one and feel its warmth briefly upon my skin and it is beautiful and I want to stay and revel in its warmth forever for it is so—<br><br>Then I open my eyes, and see once more the clouded sky above me. I am alone here.','But there is something more in that aloneness; it can only be defined in contrast to something else, no shadow without light, no self without others. I am alone, but only because of the love I have had in the past, the warmth of my village and home. If I had never had it I could not miss it, or would not know what to miss.<br><br>Who am I now, alone? How can I know?','In past, I knew myself through the mirror of others; they would say:<br><br>\"Good, you worked hard today.\"<br><br>\"You\'re just a child. What do you know?\"<br><br>\"You\'re very brave. I\'m proud of you.\"<br><br>\"No-one will want you if you act like that.\"<br><br>\"You are the sun, my dear.\"<br><br>\"You\'re useless. Fuck off.\"<br><br>And only through their words, their expectations and assumptions, would I know what I was. I would be <em>shaped</em> to be what I was. It is these words and more which formed me, like a sculptor turning clay; how could it be otherwise? An eye cannot see inside itself.'],'Next');
BridgeWall.setNext(NobodyWall);

const LProper = new Sequence();
LProper.title="LProper"
LProper.addBatchPage(['The passageway meanders back and forth, first turning in a U to the right, then continuing for a few paces, then the same to the left, and so on. It feels like walking the path of a compressed spring—so much potential, all pent up—distance, pressed into shorter space.','Eventually it straightens out. But I have the sense that I\'ve travelled an incredible way already.'],'continue');
LProper.setNext(BridgeWall);

const carryOnFleeing = new Sequence();
carryOnFleeing.title="carryOnFleeing"
carryOnFleeing.addBatchPage(['As I continue down the passage, it does not feel so narrow. Furthermore, I do not feel chased—my footsteps are solitary. Nevertheless I feel as though something is wrong, as though something has been lost in my passage by the hole of shadow.<br><br>And my footsteps do not echo.','I turn a bend, and emerge into another passageway.'],'next');
carryOnFleeing.setNext(BridgeWall);

const investigateFleeing = new Sequence();
investigateFleeing.title="investigateFleeing"
investigateFleeing.addPage('I crouch down for a closer look. The hole is pitch-black; it seems to be brimming with darkness, like the shadow wants to overflow its borders. I pick up a loose stone from the floor, and toss it in. Where it meets the surface of the shadow, it ripples, and is gone. However, as it flies through the air I realize something: it has no shadow. In fact, nothing here does. The light from the narrow gap of sky above is so evenly diffused that even my own shadow doesn\'t show. This hole is the only pool of shadow here.','next'); 
investigateFleeing.addPage('A shadow must always be cast by something—in that way it is an echo only, a dark reflection of whatever casts it. Like a parasite, it cannot exist without a host. What is this shadow, then? Is it my shadow? Is this the shadow of the <span class="labyrinth-color">labyrinth</span> itself, concentrated impossibly into this point? Such a vast and unknowable void it is.<br><br>It will likely do me no good to ponder it too long.','Carry on');
investigateFleeing.setNext(carryOnFleeing);

const chamberFleeing = new StoryNode();
chamberFleeing.title="chamberFleeing"
chamberFleeing.setText('I reach a small chamber, and skid to a stop. Here, the walls close in overtop fully, to form an archway before the chamber and then a ceiling—though the chamber itself is not much larger than the width of the passageway before it. There is a little hole in the ground, right in the centre, about a foot across. I cannot tell how deep it is. That is not to say that it is bottomless—but wherever it goes, I cannot see it. I can\'t even see the sides. What the hell?<br><br>I realize that, too, as soon as I entered the chamber, it became silent. What—or who—ever was following me must have stopped.');
chamberFleeing.addOption('Investigate the hole',investigateFleeing);
chamberFleeing.addOption('Carry on',carryOnFleeing);

const checkFleeing = new Sequence();
checkFleeing.title="checkFleeing"
checkFleeing.addPage('I dare another glance over my shoulder, and this time I am rewarded, or perhaps punished, with a glimpse of my assailant. A shadow flits across my field of vision. It seems to be human-shaped, though it\'s hard to say for sure. Could someone else have entered the <span class="labyrinth-color">labyrinth</span> with me? Why would they? I don\'t understand at all. But I now cannot stop my legs from driving me forward.','Continue');
checkFleeing.setNext(chamberFleeing);

const runFleeing = new StoryNode();
runFleeing.title="runFleeing"
runFleeing.setText('I begin to run, my soft boots echoing faintly around me. It seems that the walls are closing in, the hall becoming ever narrower... As I look ahead I see it must continue—that is, it doesn\'t close away into nothing. But still I feel my shoulder scrape against the stone and panic.<br><br>And I can\'t shake the damned feeling that <em>something is following me.</em>');
runFleeing.addOption('Continue',chamberFleeing);

const turnFleeing = new StoryNode(); 
turnFleeing.title="turnFleeing"
turnFleeing.setText('When I turn, I see nothing. The quick glance over my shoulder that I dare reveals no new information, just the shadowy walls of the <span class="labyrinth-color">labyrinth</span> behind me.  But still at every step I hear that faint pitter-patter of something following me.');

const Fleeing = new StoryNode();
Fleeing.title="Fleeing"
Fleeing.setText('The walls here curve inward, not enough to form an arched ceiling, but enough that the only sky which shows above me is a narrow sliver. It feels as though they could collapse on me at any moment.<br><br>I quicken my pace.<br><br>Something moves behind me. I hear another set of footsteps—almost matching my own in pitch and quality, but ever-so-slightly off in timing. Am I being followed?')
Fleeing.addOption('Turn',turnFleeing);
Fleeing.addOption('Run',runFleeing);

const LabyrinthProper = new StoryNode();
LabyrinthProper.title="LabyrinthProper"
LabyrinthProper.setText('I was also told that there would be some rituals and tasks to be done within, though never exactly what they would be. It\'s up to me to define when and what to do, it seems. And it is still not clear to me what manner of creature waits at the centre of the <span class="labyrinth-color">labyrinth</span>, nor what I shall have to do once I arrive.<br><br>Nothing to do but go forth and see, then.');
LabyrinthProper.addOption('Left',LProper);
LabyrinthProper.addOption('Right',Fleeing);

const enterProper = new Sequence();
enterProper.title="enterProper"
enterProper.addBatchPage(['My teacher never spoke much of my future role as Keeper of the Labyrinth—she treated it as something that I would need to experience for myself when the time came, that no guidance could truly prepare me for what I\'m confronting here:<br><br>\"It\'s something you\'ll have to figure out on your own, dear. The <span class="labyrinth-color">labyrinth</span> is something different to me than it was to my teacher, and when you enter, you will have to decide what it is to you. It won\'t be an easy task. That is the only thing I can assure you of. But promise me you will not falter in traversing it; you must be brave, or as brave as you can be.\"'],'Next');
enterProper.setNext(LabyrinthProper);

const MoveOnAnte = new Sequence();
MoveOnAnte.title='MoveOnAnte'
MoveOnAnte.addPage('I can\'t dawdle here; I need to get moving before I lose my light.<br><br>With no time to waste, I advance into the <span class="labyrinth-color">labyrinth</span> proper.','Continue')
MoveOnAnte.setNext(enterProper);

const LeaveAnte = new Sequence();
LeaveAnte.title='LeaveAnte'
LeaveAnte.addPage('Having done all there is for me to do here, I stand before the entrance to the <span class="labyrinth-color">labyrinth</span> proper and steel myself. I\'m as ready as I\'ll ever be, and the light is already beginning to fade.<br><br>I stride forth, with the obelisk watching my back.','Continue');
LeaveAnte.setNext(enterProper);

const obelisk = new StoryNode();
obelisk.title='obelisk'
obelisk.setText('The obelisk takes the form of a granite stone, about two feet across and rounded on its top. It stands at belly-height, set firmly into the ground. A small eye is carved into the side facing the gateway to the <span class="labyrinth-color">labyrinth</span> proper.<br><br>It was placed here by my predecessor. Looking upon it does not make me feel safer, but it is an ally in some way. It serves my same purpose; to watch the changes in the <span class="labyrinth-color">labyrinth</span>, and know the secrets within.<br><br>It watches me, goading me on to my task.')

const inventory = new StoryNode();
inventory.title='inventory'
inventory.setText('I find a clear patch of ground on which to sit, empty the contents of my bag, and examine all that I have brought, fanned out before me:<br><ul><li><div class="tooltip" tabindex="1">A few tapered candles,<span class="tooltiptext">For bringing light and magic, and setting anchors.</span></div></li><li><div class="tooltip" tabindex="2">A plain wand of oak,<span class="tooltiptext">For commanding and directing magic.</span></div></li><li><div class="tooltip" tabindex="3">A set of runes carved in bone, in a small leather pouch,<span class="tooltiptext">For divining.</span></div></li><li><div class="tooltip" tabindex="4">A piece of chalk, and;<span class="tooltiptext">For marking.</span></div></li><li><div class="tooltip" tabindex="5">A plain steel knife, sheathed on my belt.<span class="tooltiptext">For all the things a blade is good for.</span></div></li></ul>')

const readRunes = new StoryNode();
readRunes.title='readRunes'
readRunes.setText('I\'m not sure. But in any case, I\'m glad Death lies so far away from Body, with Change between them. This journey shall not be the one to kill me, at least.<br><br>Strange tidings indeed.');

const castRunes = new Sequence();
castRunes.title='castRunes'
castRunes.addPage('I clear away my tools to make a free patch before me. Divination, the method by which we can see an inkling of the future, is a sacred act and should be treated accordingly. Like any ritual, before beginning:<br><br><ul><li>the space should be clear of anything but the intended tools,</li><li>the mind clear of anything but the intended commands, and,</li><li>the spirit clear of doubt and receptive to the powers that be.</li></ul>','next');
castRunes.addPage('I still myself, pushing down my apprehension and excitement both, take a deep breath, and reach into the leather pouch, blindly picking five of the polished bone discs. I rattle them between my clasped hands while I speak the incantation softly, then toss the runes.<br><br>They clatter loudly against the stones of the floor.','Read them');
castRunes.addPage('I lean forward on both hands and examine their spread.<br><br>The rune for Change beside Body; whose body? mine? or the body of the <span class="labyrinth-color">labyrinth</span>?<br><br>Death lies near the Unseen and Light, which touch each other. Light with the Unseen almost always means revelation; the unseen crossing the boundary and becoming seen, known.<br><br>But why would Death lie so close to them? Does that refer to a dying of light, a more literal plunge into darkness? or could it be a loss of hope? or, could Death relate to the Unseen somehow?','next')
castRunes.setNext(readRunes);

const finishCandleAnte = new StoryNode();
finishCandleAnte.title='finishCandleAnte'
finishCandleAnte.setText('Then, I pour a few drops of wax onto the rough granite of the top of the obelisk to affix my candle, and to this candle I whisper the new truth that this place shall be my anchor to the outside world, to which I shall return.');

const CandleAnte = new Sequence();
CandleAnte.title='CandleAnte'
CandleAnte.addBatchPage(['I close my eyes and focus, feeling the natural power of the universe around me. The familiar warmth rises in a wave starting in the soles of my feet, up through my calves, my thighs, my stomach, my chest, and rests there about my heart and lungs. I hold it there a moment, then blow it forth in a narrow stream sharpening that energy into <em>flame</em>.','When I open my eyes light dances softly on the candle\'s wick.'],'Next')
CandleAnte.setNext(finishCandleAnte);

const ante = new StoryNode();
ante.title='ante'
ante.setText('The archway opens into a wide room which must be the antechamber. It would be good to rest here a moment; this may be my only chance to do so before my real work begins.<br><br>A small obelisk waits in the centre of the chamber.');
ante.addOption('Examine the obelisk',obelisk)
ante.addOption('Assay your tools',inventory)
ante.addOption('Move on',MoveOnAnte)

//
obelisk.addOption('Assay your tools',inventory);
obelisk.addOption('Move on',MoveOnAnte)

inventory.addOption('Toss the runes',castRunes);
inventory.addOption('Examine the obelisk',obelisk)
inventory.addOption('Move on',MoveOnAnte);

finishCandleAnte.addOption('Move on', MoveOnAnte);

readRunes.addOption('Move on', MoveOnAnte)
//

const LEntry = new Sequence();
LEntry.title='LEntry'
LEntry.addPage('I run my hand along the left wall to guide my way, and step forth. The wall here curves slightly to the right, then turns sharply towards a broad archway. A cold breeze flows out of it.','enter')
LEntry.setNext(ante);

const REntry = new Sequence();
REntry.title='REntry'
REntry.addPage('After a few paces, this path turns sharply to the left.<br><br>The walls tower high above me, leaving the dim sky as only a thin sliver of light. This passageway stretches on long until it reaches a large archway, about two paces across.','enter')
REntry.setNext(ante);

const enter = new StoryNode();
enter.title='enter'
enter.setText('The <span class="labyrinth-color">labyrinth</span> swallows me.<br><br>I have been told that the first few passages meet at a large antechamber. Then the <span class="labyrinth-color">labyrinth</span> proper begins and the paths meander until they reach the centre. Two paths diverge from this point, each following the curvature of the outside walls.');
enter.addOption('left',LEntry)
enter.addOption('right',REntry)

const intro = new Sequence();
intro.title='intro'
intro.addBatchPage(['The ice of the bay stretches out endlessly before the jagged black slate beach. Its shimmer is dead under the sunless sky.','Today is the day of solstice. The time for the sacred rite for which I have been preparing all year has finally come.','The gate of the <span class="labyrinth-color">labyrinth</span> watches us as we approach. I can feel its gaze beating down and I turn up the hood of my cloak against it. My cloak is wool; heavy against the bitter wind and rough against my skin. But it is warm, thankfully, and its weight is a comfort to me despite the mark of my station upon the collar.','The <span class="labyrinth-color">labyrinth</span> has been here longer than anyone can remember. Some say it was never built, but born. Either way, at this point it\'s more a part of the land than it is a structure upon it; its granite stones rise far above the crashing waves, solid in their roots. Whatever tectonic god placed them here intended them to stay a long time. But even stone crumbles eventually.','The most important thing is the boundaries: between dead and living, self and other, light and darkness, seen and unseen.<br><br>But there are no boundaries, really, are there?<br><br>No such thing as light nor shadow, just shades of grey blending together until suddenly what you thought <em>was</em> is something else. Blurred shapes darting through your periphery. Despite this, we have to delineate these boundaries. Obelisk in the woods, talisman on the door, walls drawing the line around our little village. It keeps us safe. Keeps what\'s out there, there, and what\'s here, here. Even if it is abstract.<br><br>It\'s all we can do.','Since no boundary is absolute, the walls of the <span class="labyrinth-color">labyrinth</span> cannot be thought of as containing anything. They hold no space between them, only distort it, twist what would be a straight path into a curved one, wend it back on itself into a horseshoe, a spiral. What the <span class="labyrinth-color">labyrinth</span> contains is unstoppable. The only thing that can be done is to put time and space between it and us.<br><br>That\'s my job, as Keeper of the Labyrinth.'],'next')
intro.addPage('The men, here to see me off, wait at the gate. They do not feel its gaze, though they can see the vast eye carved on its keystone just the same. It is my sacred duty alone to enter the <span class="labyrinth-color">labyrinth</span>, and navigate its winding passageways to the centre where my quarry rests. On the shortest day of each year, the village witch, taking the title of Keeper, is sent away into those frozen halls to meet with it, eschewing the warm fires and feasting of the village\'s Midwinter festival for a greater task. Since the passing of my teacher last spring, this year it is my turn.<br><br>My boots scuff softly as I stop in the entrance.', 'enter')
intro.setNext(enter);