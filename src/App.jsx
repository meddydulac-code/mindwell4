import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════════
const T = {
  bg: "#050508", bgCard: "#0C0C12", bgElevated: "#13131C",
  gold: "#C8A97E", goldDim: "#8A7255", cream: "#F0EDE8",
  muted: "#5A5865", mutedLight: "#8A8796",
  border: "#1E1E2A", borderGold: "rgba(200,169,126,0.25)",
};

// ═══════════════════════════════════════════════════════════════════════════════
// WOUNDS DATA
// ═══════════════════════════════════════════════════════════════════════════════
const WOUNDS = {
  abandon: {
    id: "abandon", name: "Blessure d'Abandon", shortName: "Abandon",
    tagline: "Tu aimes intensément. Et tu attends, en secret, que tout s'effondre.",
    color: "#3B6EA8", icon: "◈",
    shortDesc: "Quelque chose en toi a appris très tôt que les gens partent. Même quand tout va bien, une partie de toi surveille les signes — le silence qui dure trop, le message qui tarde, le regard qui change. Tu n'es pas anxieux(se). Tu es vigilant(e). Il y a une différence que peu de gens comprennent.",
    protects: "le besoin d'être présent(e) pour les autres avant qu'ils disparaissent",
    origin: "une figure d'attachement absente, imprévisible, ou émotionnellement indisponible dans les premières années",
    defense: "l'hypervigilance relationnelle — surveiller les signaux de départ avant qu'ils arrivent",
    paradox: "Tu cherches la sécurité dans des relations qui reproduisent précisément l'insécurité que tu fuis",
    love: "En amour, tu t'investis intensément — parfois trop vite. Mais en parallèle, une partie de toi surveille. Les messages qui tardent, le ton qui change. Tu interprètes ces signaux à travers le prisme de 'il/elle va partir.' Tu peux te retrouver à tester l'autre sans le formuler — cherchant une preuve que cette fois, c'est différent. Et parfois, ces tests créent exactement ce que tu craignais.",
    work: "Au travail, tu peux avoir du mal à déléguer — pas par incapacité, mais parce que si tu lâches, quelque chose pourrait mal tourner. La peur d'être mis à l'écart d'un projet peut déclencher une réponse émotionnelle disproportionnée.",
    attracts: "Sans t'en rendre compte, tu attires des personnes à la disponibilité émotionnelle limitée. Pas parce que tu le cherches consciemment — mais parce que cette dynamique te semble familière. Quelqu'un de pleinement disponible peut même te sembler étouffant.",
    confuses: "Tu confonds l'intensité avec l'amour. Quand quelqu'un occupe tout ton espace mental, tu interprètes ça comme de l'amour profond. Mais ce niveau d'intensité peut être le signe d'une activation anxieuse, pas d'une connexion saine.",
    behaviors: ["Chaque fois que tu envoies un message et que tu vérifies immédiatement s'il a été lu : note-le. Observe la durée d'attente que tu peux tolérer. Cette durée te dit quelque chose sur l'intensité de l'activation.", "Chaque fois que tu t'éloignes d'une relation par anticipation — avant d'être quitté(e) — identifie le déclencheur. Qu'est-ce qui t'a signalé que l'autre allait partir ?", "Chaque fois que tu surinterprètes un silence : pose-toi cette question avant de réagir — « Est-ce que j'ai une information concrète, ou est-ce que je projette ? »"],
  },
  rejet: {
    id: "rejet", name: "Blessure de Rejet", shortName: "Rejet",
    tagline: "Tu n'as pas peur d'être seul(e). Tu as peur de ne pas mériter d'être choisi(e).",
    color: "#7B3FA8", icon: "◇",
    shortDesc: "Tu doutes de ta valeur intrinsèque. Pas bruyamment. Silencieusement, à chaque regard qui ne s'attarde pas assez, à chaque invitation non reçue. Tu te compares sans le vouloir, et tu conclus trop vite que l'autre a fait le bon choix en ne te choisissant pas.",
    protects: "l'image de quelqu'un qui n'a pas besoin des autres pour exister",
    origin: "des expériences répétées où ta présence semblait déranger, peser, ou ne pas être souhaitée",
    defense: "l'anticipation du rejet — tu pars avant d'être quitté(e), tu te retires avant d'être exclu(e)",
    paradox: "Tu t'isoles pour ne pas être rejeté(e), et cet isolement confirme ta croyance d'être indésirable",
    love: "En amour, tu oscilles entre le désir de connexion et la protection préventive. Avant même qu'une relation commence vraiment, une partie de toi évalue : 'Est-ce qu'il/elle va finir par me rejeter ?' Cette anticipation peut te faire saboter des relations qui auraient pu fonctionner.",
    work: "Au travail, tu surveilles comment tu es perçu(e). Tu peux sur-performer pour justifier ta place. La critique, même constructive, peut être reçue comme une confirmation de ta non-valeur plutôt que comme une information utile.",
    attracts: "Tu attires souvent des personnes distantes dont tu dois 'mériter' l'attention. Cette dynamique te semble normale. Une personne qui t'offre clairement de l'amour peut paraître suspecte.",
    confuses: "Tu confonds l'acceptation conditionnelle avec de l'amour. Quand quelqu'un t'aime 'malgré' quelque chose, tu ressens ça comme un amour authentique. Quand quelqu'un t'aime simplement, tu peux ne pas y croire.",
    behaviors: ["Chaque fois que tu t'empêches de parler ou d'agir par peur de la réaction des autres : note dans quel contexte ça arrive.", "Chaque fois que tu interprètes l'indifférence de quelqu'un comme du rejet : demande-toi si tu as une preuve concrète ou si tu remplis un silence avec ta peur habituelle.", "Chaque fois que tu reçois une critique — même bienveillante — observe ta réaction physique dans les 30 premières secondes."],
  },
  humiliation: {
    id: "humiliation", name: "Blessure d'Humiliation", shortName: "Humiliation",
    tagline: "Tu prends moins de place pour éviter d'en prendre trop.",
    color: "#A86B3F", icon: "◉",
    shortDesc: "On t'a fait comprendre, un jour, que ton enthousiasme était trop grand, tes émotions trop intenses, tes besoins trop lourds. Alors tu as appris à te rétrécir. À te justifier avant même qu'on te demande. À t'excuser d'exister un peu trop fort.",
    protects: "la partie de toi qui veut exister pleinement, être vue, prendre de l'espace",
    origin: "des messages reçus que tes besoins, émotions, ou expressions étaient trop lourds ou embarrassants",
    defense: "la minimisation — te rendre petit(e), invisible, inoffensif(ve) avant qu'on te le demande",
    paradox: "En t'effaçant pour ne pas déranger, tu deviens quelqu'un que personne ne voit vraiment — ce qui confirme que tu ne mérites pas d'espace",
    love: "En amour, tu as tendance à te mettre en retrait émotionnel — à minimiser tes besoins, à t'adapter aux attentes de l'autre. Tu peux paraître autonome alors que tu es simplement prudent(e). Cette prudence empêche une intimité réelle.",
    work: "Au travail, tu minimises tes contributions pour éviter d'attirer trop d'attention. Tu peux avoir du mal à défendre tes idées en public ou à revendiquer ce que tu as accompli.",
    attracts: "Tu peux attirer des personnalités dominantes qui prennent naturellement de la place. Cette dynamique valide ton rôle d'effacement. Mais elle te prive de réciprocité.",
    confuses: "Tu confonds le fait de te rendre indispensable avec être aimé(e). Si tu fais assez, si tu t'effaces assez — alors tu mérites peut-être d'avoir une place. Mais cette dynamique n'est pas de l'amour.",
    behaviors: ["Chaque fois que tu minimises une contribution ou un accomplissement : note-le. 'Ce n'est pas grand chose' est souvent une protection automatique.", "Chaque fois que tu t'excuses sans que ce soit nécessaire : observe le déclencheur. Tu t'excuses de quoi, exactement ?", "Chaque fois que tu retiens une opinion parce que 'ça va déranger' : pose-toi la question — est-ce que ça va vraiment déranger, ou est-ce ta blessure qui parle ?"],
  },
  trahison: {
    id: "trahison", name: "Blessure de Trahison", shortName: "Trahison",
    tagline: "Tu fais confiance. Mais tu n'oublies jamais.",
    color: "#A83F3F", icon: "◆",
    shortDesc: "Il y a en toi une capacité à aimer profondément — et une mémoire parfaite des fois où ça a mal tourné. Tu testes sans t'en rendre compte. Tu analyses les incohérences. Et quand quelqu'un te déçoit, quelque chose se ferme, lentement, définitivement.",
    protects: "la capacité à s'ouvrir à nouveau après avoir été blessé(e)",
    origin: "une rupture de confiance fondamentale — promesse brisée, mensonge répété, ou trahison par quelqu'un sur qui tu comptais absolument",
    defense: "le contrôle informationnel — tu testes les gens, tu vérifies les cohérences, tu gardes une partie de toi inaccessible",
    paradox: "Tu cherches des personnes absolument fiables, mais ton niveau d'exigence rend toute relation humaine imparfaite — donc potentiellement traîtresse",
    love: "En amour, tu portes une mémoire longue. Tu peux pardonner en surface, mais quelque chose en toi garde trace. Tu testes sans l'avouer. Tu gardes une sortie de secours émotionnelle, même dans les relations les plus solides.",
    work: "Au travail, tu observes plus que tu ne participes. Tu remarques les incohérences. Tu peux avoir du mal à faire confiance à un manager. Et quand une trahison arrive — même mineure — elle a un impact disproportionné.",
    attracts: "Tu attires souvent des personnes complexes, à plusieurs couches. Cette complexité te captive, même si elle devrait parfois t'alerter.",
    confuses: "Tu confonds la transparence totale avec la sécurité. Si quelqu'un te dit tout, sans zones d'ombre, tu te sens en confiance. Mais l'intimité réelle laisse de l'espace à l'autre pour avoir une vie intérieure.",
    behaviors: ["Chaque fois que tu testes quelqu'un — implicitement, sans le formuler — identifie le test. Qu'est-ce que tu cherches à vérifier ?", "Chaque fois qu'une incohérence mineure chez l'autre déclenche une réaction forte : note l'écart entre l'événement et ta réaction.", "Chaque fois que tu gardes une information pour toi par précaution : demande-toi si cette protection te coûte plus qu'elle ne te donne."],
  },
  injustice: {
    id: "injustice", name: "Blessure d'Injustice", shortName: "Injustice",
    tagline: "Tu exiges beaucoup des autres. Parce que tu t'es toujours exigé autant de toi-même.",
    color: "#8B7A2A", icon: "◪",
    shortDesc: "Le monde te semble souvent déséquilibré. Tu vois ce qui n'est pas juste, ce qui n'est pas honnête. Et quelque part, tu portes une colère sourde — contre ceux qui ne jouent pas selon les règles, contre toi-même quand tu n'es pas à la hauteur.",
    protects: "un sens profond de la valeur personnelle lié à la performance et au mérite",
    origin: "un environnement où l'amour était distribué selon la performance ou la conformité à des standards rigides",
    defense: "le perfectionnisme — si tout est parfait, personne ne peut te reprocher quoi que ce soit",
    paradox: "Ton exigence envers toi-même et les autres crée une rigidité qui empêche les connexions imparfaites — les seules qui existent vraiment",
    love: "En amour, tu es généreux(se) mais tu gardes des comptes sans le vouloir. Tu donnes beaucoup. Tu espères une réciprocité équivalente. Quand elle n'est pas là, la frustration s'accumule silencieusement — et explose à un moment qui surprend l'autre.",
    work: "Au travail, tu fonctionnes bien dans des environnements méritocratiques. Mais face à l'injustice — un effort non reconnu — tu peux développer une frustration intense.",
    attracts: "Tu attires souvent des personnes qui ont besoin de donner moins qu'elles ne reçoivent. Ton niveau de générosité crée un déséquilibre que certaines personnes exploitent.",
    confuses: "Tu confonds la réciprocité parfaite avec l'amour. Mais l'amour réel n'est pas une balance — il y a des périodes où l'un donne plus.",
    behaviors: ["Chaque fois que tu réalises que tu as beaucoup donné sans recevoir : observe si tu avais formulé clairement ce dont tu avais besoin.", "Chaque fois que la frustration monte face à quelqu'un : identifie si tu réagis à maintenant, ou à l'accumulation.", "Chaque fois que tu juges sévèrement quelqu'un pour quelque chose que tu t'autorises rarement : note la dissonance."],
  },
  honte: {
    id: "honte", name: "Blessure de Honte", shortName: "Honte",
    tagline: "Tu te caches non par timidité. Par peur d'être vu(e) tel(le) que tu es vraiment.",
    color: "#5A3A6B", icon: "◎",
    shortDesc: "Quelque chose en toi croit, malgré toi, que si les gens voyaient tout — tes pensées, tes peurs, tes contradictions — ils s'éloigneraient. Alors tu gères ton image. Tu choisis soigneusement ce que tu montres. Et tu vis avec cette fatigue de devoir toujours être une version acceptable de toi.",
    protects: "le noyau intime de qui tu es — la partie que tu crois inacceptable",
    origin: "des expériences où ton identité profonde a été jugée, moquée, ou rejetée",
    defense: "la gestion de l'image — contrôler soigneusement ce que tu montres, rester dans un rôle acceptable",
    paradox: "Plus tu gères ton image, moins les gens te connaissent vraiment — et plus tu te sens seul(e) dans la relation",
    love: "En amour, tu montres une version de toi soigneusement choisie. Tu retiens les parties que tu crois inacceptables. Et cette retenue crée une distance intérieure que les autres ressentent parfois comme de la froideur.",
    work: "Au travail, tu travailles souvent dur pour compenser une impression de ne pas être suffisamment compétent(e). Le syndrome de l'imposteur est probablement familier.",
    attracts: "Tu attires souvent des personnes qui semblent 'avoir tout compris'. Leur certitude contraste avec ton doute interne. Mais tu peux aussi attirer des personnes qui ont intérêt à ce que tu restes dans le doute.",
    confuses: "Tu confonds être parfaitement présentable avec être aimé(e). Si tu montres la bonne version de toi, peut-être seras-tu accepté(e). Mais les gens t'aiment toi, pas ta performance.",
    behaviors: ["Chaque fois que tu gères ton image avant de répondre — que tu choisis tes mots pour projeter une certaine image plutôt que pour exprimer ce que tu ressens vraiment.", "Chaque fois que tu ressens de la honte sans pouvoir identifier clairement pourquoi : note le contexte.", "Chaque fois que tu caches une partie de toi par anticipation du jugement : demande-toi qui tu imagines en train de juger. C'est souvent toi-même."],
  },
  vide: {
    id: "vide", name: "Blessure de Vide", shortName: "Vide",
    tagline: "Tu cherches quelque chose que tu n'as pas encore de mots pour nommer.",
    color: "#2A5A5A", icon: "○",
    shortDesc: "Il y a des jours où tu te sens décroché(e) de toi-même. Présent(e) en surface, absent(e) à l'intérieur. Tu remplis les silences avec du bruit, les soirées avec de l'activité. Parce que quand tout s'arrête, il reste quelque chose que tu ne sais pas encore comment regarder en face.",
    protects: "la possibilité que quelque chose de mieux existe, que ce vide ne soit pas permanent",
    origin: "une présence émotionnelle insuffisante — des adultes physiquement là mais psychologiquement absents",
    defense: "le remplissage — activité, relations, écrans, bruit — tout ce qui empêche de rester seul(e) avec soi-même",
    paradox: "En fuyant le vide, tu ne construis jamais la relation à toi-même qui serait la seule chose capable de le combler",
    love: "En amour, tu cherches quelqu'un qui comble le silence intérieur. Mais aucune relation ne peut faire ça durablement. Tu peux t'attacher intensément à des personnes parce qu'elles te font sentir présent(e) — puis te retrouver de nouveau seul(e) quand la nouveauté s'estompe.",
    work: "Au travail, tu peux chercher un sens que les tâches ordinaires ne donnent pas. Tu explores, testes. Ce n'est pas de l'instabilité — c'est une recherche authentique. Mais elle peut rendre difficile l'engagement sur le long terme.",
    attracts: "Tu peux attirer des personnes très présentes et enthousiastes dont l'énergie comble temporairement le silence intérieur. Mais quand leur présence devient routinière, le vide revient.",
    confuses: "Tu confonds l'excitation du début avec de l'amour. Les premières semaines te font sentir pleinement présent(e). Mais cette intensité est neurochimique, pas relationnelle.",
    behaviors: ["Chaque fois que tu remplis le silence intérieur avec une stimulation externe : note si tu fais un choix conscient ou si c'est automatique.", "Chaque fois que tu te sens soudainement désintéressé(e) par quelque chose qui t'enthousiasmait : observe si c'est de la lassitude réelle ou une forme de fuite.", "Chaque fois que tu te sens vraiment présent(e) à toi-même — note ce qui s'est passé juste avant. Ces moments sont des données précieuses."],
  },
  hypercontrole: {
    id: "hypercontrole", name: "Blessure de Surcontrôle", shortName: "Surcontrôle",
    tagline: "Tu portes tout seul(e). Parce que tu as appris que personne ne le ferait à ta place.",
    color: "#3A5A2A", icon: "◫",
    shortDesc: "Tu anticipes, tu prépares, tu gères. Non par plaisir, mais parce que lâcher le contrôle t'a déjà coûté quelque chose. Tu as du mal à déléguer, à demander de l'aide, à laisser les choses imparfaites. Et dans cette vigilance permanente, il y a une fatigue profonde que peu de gens voient.",
    protects: "la capacité à fonctionner dans un monde perçu comme imprévisible ou menaçant",
    origin: "un environnement chaotique où la seule sécurité disponible était celle que tu créais toi-même",
    defense: "l'anticipation totale — planifier, contrôler, gérer pour éviter d'être pris(e) par surprise",
    paradox: "Ton besoin de tout contrôler épuise ceux qui t'entourent et te prive de la spontanéité qui rendrait la vie vivable",
    love: "En amour, tu aimes profondément — mais difficilement. Tu gères, tu anticipes, tu structures. Et parfois tu noies une relation sous le poids de ta vigilance.",
    work: "Au travail, tu es souvent le pilier sur qui on peut compter. Mais tu délègues mal, tu peines à accepter un travail 'assez bon', et tu portes des responsabilités que les autres devraient partager.",
    attracts: "Tu peux attirer des personnes moins organisées qui semblent avoir besoin d'être cadrées. Tu prends naturellement ce rôle. Et tu finis épuisé(e) par une relation asymétrique.",
    confuses: "Tu confonds le contrôle avec de la sécurité. Si tu peux tout prévoir, tout organiser — alors tu seras en sécurité. Mais la vraie sécurité dans une relation se construit dans la confiance, pas le contrôle.",
    behaviors: ["Chaque fois que tu prends en charge quelque chose que l'autre aurait pu gérer : demande-toi si tu l'aides ou si tu évites l'inconfort de ne pas contrôler le résultat.", "Chaque fois que tu ne peux pas dormir à cause de quelque chose que tu ne peux pas résoudre : note ce que tu cherches à contrôler.", "Chaque fois que quelqu'un fait quelque chose différemment de comment tu l'aurais fait : observe ta réaction interne. Est-ce que 'différent' devient automatiquement 'mauvais' ?"],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// QUESTIONS
// ═══════════════════════════════════════════════════════════════════════════════
const QUESTIONS = [
  { id:1, text:"Quand quelqu'un ne répond pas à tes messages, ta première pensée est…", sub:"Choisis ce qui résonne le plus vrai, même si c'est inconfortable.", options:[{label:"Il s'est passé quelque chose. Il va bien ?",weights:{abandon:2}},{label:"J'ai dû dire quelque chose de mal.",weights:{honte:2,rejet:1}},{label:"Il me fait exprès.",weights:{trahison:2,hypercontrole:1}},{label:"Je ne compte pas vraiment.",weights:{rejet:2,abandon:1}}] },
  { id:2, text:"L'amour que tu as reçu enfant était…", sub:"Il n'y a pas de bonne réponse. Juste la tienne.", options:[{label:"Présent mais conditionnel — selon comment je me comportais.",weights:{honte:2,hypercontrole:1}},{label:"Imprévisible. Chaud puis froid, sans raison apparente.",weights:{abandon:2,trahison:1}},{label:"Absent ou insuffisant. Je me débrouillais.",weights:{vide:2,abandon:1}},{label:"Envahissant. Peu d'espace pour exister à ma façon.",weights:{hypercontrole:2,humiliation:1}}] },
  { id:3, text:"Dans une dispute, tu as tendance à…", sub:"Observe-toi honnêtement.", options:[{label:"Me fermer et disparaître jusqu'à ce que ça passe.",weights:{abandon:1,vide:2}},{label:"M'excuser, même quand j'ai raison.",weights:{honte:2,humiliation:1}},{label:"Tout analyser mentalement jusqu'à l'épuisement.",weights:{hypercontrole:2,trahison:1}},{label:"Exploser, puis regretter l'intensité de ma réaction.",weights:{trahison:1,injustice:2}}] },
  { id:4, text:"La phrase qui te touche le plus en ce moment :", sub:"Laisse-toi surprendre par ta réaction.", options:[{label:"« Tu mérites d'être vu(e). »",weights:{vide:2,rejet:1}},{label:"« Tu peux lâcher prise. »",weights:{hypercontrole:2,honte:1}},{label:"« Tu n'es pas trop. »",weights:{humiliation:2,honte:1}},{label:"« Tu n'es pas seul(e). »",weights:{abandon:2,vide:1}}] },
  { id:5, text:"Quand tu réussis quelque chose d'important, tu penses souvent…", sub:"Ta voix intérieure, pas celle que tu voudrais avoir.", options:[{label:"C'était de la chance. Ça ne compte pas vraiment.",weights:{honte:2,humiliation:1}},{label:"Ils vont finir par voir que je ne mérite pas ça.",weights:{honte:2,rejet:1}},{label:"Enfin. Mais ce n'est toujours pas assez.",weights:{hypercontrole:2,injustice:1}},{label:"J'aurais aimé que quelqu'un se réjouisse vraiment avec moi.",weights:{abandon:2,vide:1}}] },
  { id:6, text:"Le silence entre toi et quelqu'un que tu aimes te semble…", sub:null, options:[{label:"Insupportable. Il y a forcément un problème.",weights:{abandon:2,hypercontrole:1}},{label:"Acceptable. Je préfère ça aux mots inutiles.",weights:{vide:2,humiliation:1}},{label:"Suspect. Je cherche ce que j'ai fait de mal.",weights:{honte:2,rejet:1}},{label:"Douloureux. J'aimerais qu'il/elle parle le premier.",weights:{trahison:1,abandon:2}}] },
  { id:7, text:"Petite question difficile :", sub:"Est-ce que tu te sens fondamentalement digne d'être aimé(e) ?", options:[{label:"Oui, pleinement. Je n'ai pas de doute là-dessus.",weights:{}},{label:"Oui, mais j'ai du mal à y croire vraiment.",weights:{honte:1,rejet:1}},{label:"Non. Je dois le mériter d'abord.",weights:{honte:2,hypercontrole:1}},{label:"Je ne sais pas. La question me trouble.",weights:{vide:2,abandon:1}}] },
  { id:8, text:"Dans tes relations, tu es souvent celui/celle qui…", sub:null, options:[{label:"Donne plus qu'il/elle ne reçoit.",weights:{abandon:1,injustice:2}},{label:"S'efface pour ne pas déranger.",weights:{humiliation:2,honte:1}},{label:"Teste l'autre pour voir s'il reste vraiment.",weights:{trahison:2,abandon:1}},{label:"Contrôle pour éviter d'être blessé(e).",weights:{hypercontrole:2,trahison:1}}] },
  { id:9, text:"Tes parents — ou figures principales — te voyaient comme…", sub:"Même si c'est douloureux à regarder.", options:[{label:"Un enfant difficile, trop sensible, ou trop intense.",weights:{humiliation:2,rejet:1}},{label:"Quelqu'un à gérer plus qu'à comprendre.",weights:{vide:2,honte:1}},{label:"Un prolongement d'eux-mêmes, pas vraiment séparé.",weights:{hypercontrole:2,humiliation:1}},{label:"Quelqu'un qu'ils aimaient, à leur manière imparfaite.",weights:{abandon:1,trahison:1}}] },
  { id:10, text:"Dans une relation idéale, ce que tu veux surtout c'est…", sub:null, options:[{label:"Être sûr(e) que l'autre ne partira pas.",weights:{abandon:2,trahison:1}},{label:"Être accepté(e) sans avoir à te cacher.",weights:{honte:2,humiliation:1}},{label:"Être choisi(e) pour qui tu es vraiment.",weights:{rejet:2,vide:1}},{label:"Avoir de l'espace tout en étant pleinement aimé(e).",weights:{hypercontrole:1,vide:2}}] },
  { id:11, text:"La blessure que tu as le plus de mal à dépasser :", sub:null, options:[{label:"Quand quelqu'un est parti sans explication.",weights:{abandon:2,trahison:1}},{label:"Quand on m'a humilié(e) devant les autres.",weights:{humiliation:2,honte:1}},{label:"Quand on m'a menti en me regardant dans les yeux.",weights:{trahison:2,injustice:1}},{label:"Quand on m'a fait croire que j'étais trop ou pas assez.",weights:{rejet:2,honte:1}}] },
  { id:12, text:"La nuit, quand tu ne dors pas, tu penses à…", sub:"Ce qui revient en boucle.", options:[{label:"Des conversations que j'aurais dû gérer autrement.",weights:{honte:2,hypercontrole:1}},{label:"Des gens qui ne pensent peut-être plus à moi.",weights:{abandon:2,vide:1}},{label:"Des injustices que je n'ai pas pu corriger.",weights:{injustice:2,trahison:1}},{label:"Un futur flou qui m'angoisse.",weights:{hypercontrole:2,abandon:1}}] },
  { id:13, text:"Tu te reconnais dans cette phrase ?", sub:"« Je préfère m'éloigner avant qu'on m'éloigne. »", options:[{label:"Complètement. C'est exactement ce que je fais.",weights:{abandon:2,trahison:2}},{label:"Parfois. Quand j'ai vraiment peur.",weights:{abandon:1,rejet:1}},{label:"Non, je fais l'inverse : je m'accroche trop.",weights:{abandon:2,hypercontrole:1}},{label:"Non. J'affronte.",weights:{injustice:1}}] },
  { id:14, text:"Si quelqu'un lisait tes pensées en ce moment, tu aurais…", sub:null, options:[{label:"Honte de ce qu'ils verraient.",weights:{honte:2,humiliation:1}},{label:"Peur d'être mal jugé(e).",weights:{rejet:2,honte:1}},{label:"Soulagement que quelqu'un comprenne enfin.",weights:{vide:2,abandon:1}},{label:"Anxiété qu'ils mal-interprètent.",weights:{hypercontrole:2,trahison:1}}] },
  { id:15, text:"Dernière question. Celle qui compte.", sub:"Ce que tu veux vraiment au fond de toi, c'est…", options:[{label:"Être enfin en paix avec qui je suis.",weights:{honte:2,vide:1}},{label:"Comprendre pourquoi je répète toujours les mêmes schémas.",weights:{trahison:1,hypercontrole:2}},{label:"Trouver quelqu'un qui reste vraiment.",weights:{abandon:2,rejet:1}},{label:"Arrêter d'avoir peur de prendre de la place.",weights:{humiliation:2,rejet:1}}] },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SCORING
// ═══════════════════════════════════════════════════════════════════════════════
function calculateScores(answers) {
  const scores = {abandon:0,rejet:0,humiliation:0,trahison:0,injustice:0,honte:0,vide:0,hypercontrole:0};
  answers.forEach((idx, qi) => {
    const opt = QUESTIONS[qi]?.options[idx];
    if (!opt?.weights) return;
    Object.entries(opt.weights).forEach(([k,v]) => { scores[k] = (scores[k]||0)+v; });
  });
  const sorted = Object.entries(scores).sort((a,b)=>b[1]-a[1]);
  const max = sorted[0][1];
  return { scores, dominant: sorted[0][0], secondary: sorted[1][0], intensity: max>=10?"high":max>=6?"medium":"low" };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════
function NeuralBackground() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); let animId;
    const nodes = Array.from({length:28},()=>({x:Math.random()*window.innerWidth,y:Math.random()*window.innerHeight,vx:(Math.random()-0.5)*0.3,vy:(Math.random()-0.5)*0.3,r:Math.random()*1.5+0.5}));
    const resize = () => { canvas.width=window.innerWidth; canvas.height=window.innerHeight; };
    resize(); window.addEventListener("resize",resize);
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      nodes.forEach(n=>{ n.x+=n.vx; n.y+=n.vy; if(n.x<0||n.x>canvas.width)n.vx*=-1; if(n.y<0||n.y>canvas.height)n.vy*=-1; });
      nodes.forEach((a,i)=>{
        nodes.forEach((b,j)=>{ if(j<=i)return; const d=Math.sqrt((a.x-b.x)**2+(a.y-b.y)**2); if(d<180){ctx.strokeStyle=`rgba(200,169,126,${(1-d/180)*0.12})`;ctx.lineWidth=0.6;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}});
        ctx.beginPath();ctx.arc(a.x,a.y,a.r,0,Math.PI*2);ctx.fillStyle="rgba(200,169,126,0.35)";ctx.fill();
      });
      animId=requestAnimationFrame(draw);
    };
    draw();
    return ()=>{ cancelAnimationFrame(animId); window.removeEventListener("resize",resize); };
  },[]);
  return <canvas ref={canvasRef} style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",opacity:0.6}} />;
}

function Glow({color=T.gold,size=300,x="50%",y="50%",op=0.08}) {
  return <div style={{position:"absolute",width:size,height:size,borderRadius:"50%",background:`radial-gradient(circle,${color} 0%,transparent 70%)`,left:x,top:y,transform:"translate(-50%,-50%)",opacity:op,pointerEvents:"none",filter:"blur(40px)"}} />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LANDING
// ═══════════════════════════════════════════════════════════════════════════════
function LandingScreen({onStart}) {
  const [v,setV]=useState(false);
  useEffect(()=>{setTimeout(()=>setV(true),100);},[]);
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px",textAlign:"center",position:"relative",overflow:"hidden"}}>
      <Glow color={T.gold} size={500} x="50%" y="40%" op={0.06}/>
      <Glow color="#3B6EA8" size={300} x="20%" y="70%" op={0.05}/>
      <div style={{opacity:v?1:0,transform:v?"translateY(0)":"translateY(20px)",transition:"all 1s cubic-bezier(0.16,1,0.3,1)"}}>
        <div style={{marginBottom:48}}>
          <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:13,letterSpacing:6,color:T.goldDim,textTransform:"uppercase",marginBottom:16}}>M I N D W E L L</div>
          <div style={{width:40,height:1,background:T.borderGold,margin:"0 auto"}}/>
        </div>
        <h1 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:"clamp(30px,8vw,54px)",fontWeight:700,color:T.cream,lineHeight:1.15,marginBottom:20,maxWidth:540}}>
          Ce test ne mesure pas ta personnalité.<br/><span style={{color:T.gold}}>Il lit ta blessure principale.</span>
        </h1>
        <p style={{fontFamily:"DM Sans,sans-serif",fontSize:17,color:T.mutedLight,lineHeight:1.7,maxWidth:420,marginBottom:40}}>
          15 questions. Une analyse IA. Le schéma émotionnel qui gouverne ta vie — sans que tu t'en rendes vraiment compte.
        </p>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginBottom:36}}>
          <div style={{display:"flex"}}>
            {["#C8A97E","#A87E9E","#7E9EA8","#9EA87E"].map((c,i)=>(
              <div key={i} style={{width:28,height:28,borderRadius:"50%",background:c,border:`2px solid ${T.bg}`,marginLeft:i>0?-8:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:T.bg,fontWeight:700}}>
                {["M","S","A","L"][i]}
              </div>
            ))}
          </div>
          <span style={{fontFamily:"DM Sans,sans-serif",fontSize:14,color:T.muted}}><strong style={{color:T.mutedLight}}>12 847</strong> analyses cette semaine</span>
        </div>
        <button onClick={onStart}
          style={{background:`linear-gradient(135deg,${T.gold} 0%,#A8865A 100%)`,color:"#050508",border:"none",padding:"18px 48px",borderRadius:50,fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"DM Sans,sans-serif",boxShadow:`0 0 40px rgba(200,169,126,0.25)`,transition:"all 0.3s ease",display:"block",margin:"0 auto"}}
          onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.03)";e.currentTarget.style.boxShadow=`0 0 60px rgba(200,169,126,0.4)`;}}
          onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow=`0 0 40px rgba(200,169,126,0.25)`;}}
        >Commencer l'analyse →</button>
        <p style={{fontFamily:"DM Sans,sans-serif",fontSize:12,color:T.muted,marginTop:14}}>Gratuit · 2 minutes · Aucune inscription</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUIZ
// ═══════════════════════════════════════════════════════════════════════════════
function QuizScreen({question,qIndex,total,onAnswer,selected}) {
  const [entered,setEntered]=useState(false);
  const [hov,setHov]=useState(null);
  useEffect(()=>{setEntered(false);setTimeout(()=>setEntered(true),50);},[question.id]);
  const pct=(qIndex/total)*100;
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",padding:"0 24px",position:"relative"}}>
      <div style={{position:"fixed",top:0,left:0,right:0,height:2,background:T.border,zIndex:10}}>
        <div style={{height:"100%",background:`linear-gradient(90deg,${T.gold},#A8865A)`,width:`${pct}%`,transition:"width 0.6s cubic-bezier(0.16,1,0.3,1)",boxShadow:`0 0 8px ${T.gold}`}}/>
      </div>
      <div style={{maxWidth:560,width:"100%",margin:"0 auto",display:"flex",flexDirection:"column",flex:1,justifyContent:"center",paddingTop:80,paddingBottom:60}}>
        <div style={{fontFamily:"DM Sans,sans-serif",fontSize:12,color:T.muted,letterSpacing:3,textTransform:"uppercase",marginBottom:32,opacity:entered?1:0,transition:"opacity 0.5s ease 0.1s"}}>
          {qIndex+1} / {total}
        </div>
        <h2 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:"clamp(22px,5vw,30px)",fontWeight:700,color:T.cream,lineHeight:1.3,marginBottom:12,opacity:entered?1:0,transform:entered?"translateY(0)":"translateY(16px)",transition:"all 0.6s cubic-bezier(0.16,1,0.3,1) 0.05s"}}>
          {question.text}
        </h2>
        {question.sub&&<p style={{fontFamily:"DM Sans,sans-serif",fontSize:15,color:T.muted,marginBottom:32,lineHeight:1.6,opacity:entered?1:0,transition:"opacity 0.5s ease 0.2s"}}>{question.sub}</p>}
        {!question.sub&&<div style={{marginBottom:32}}/>}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {question.options.map((opt,i)=>{
            const isSel=selected===i;
            return (
              <button key={i} onClick={()=>onAnswer(i)} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}
                style={{background:isSel?`linear-gradient(135deg,rgba(200,169,126,0.15),rgba(200,169,126,0.05))`:hov===i?"rgba(255,255,255,0.04)":T.bgCard,border:isSel?`1px solid ${T.gold}`:`1px solid ${T.border}`,borderRadius:12,padding:"18px 20px",textAlign:"left",cursor:"pointer",fontFamily:"DM Sans,sans-serif",fontSize:15,color:isSel?T.cream:T.mutedLight,lineHeight:1.4,transition:"all 0.25s ease",transform:isSel?"translateX(4px)":"translateX(0)",opacity:entered?1:0,transitionDelay:`${0.15+i*0.08}s`,display:"flex",alignItems:"center",gap:14,boxShadow:isSel?`0 0 20px rgba(200,169,126,0.1)`:"none"}}>
                <span style={{width:20,height:20,borderRadius:"50%",border:isSel?`2px solid ${T.gold}`:`2px solid ${T.border}`,background:isSel?T.gold:"transparent",flexShrink:0,transition:"all 0.25s ease",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {isSel&&<span style={{width:8,height:8,borderRadius:"50%",background:T.bg}}/>}
                </span>
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOADER
// ═══════════════════════════════════════════════════════════════════════════════
function LoaderScreen({onComplete}) {
  const [phase,setPhase]=useState(0);
  const [pct,setPct]=useState(0);
  const phases=["Analyse des patterns émotionnels…","Cartographie des schémas d'attachement…","Identification des blessures profondes…","Corrélation avec 12 847 profils similaires…","Génération de ton rapport psychologique…"];
  useEffect(()=>{
    let cur=0;
    const iv=setInterval(()=>{
      cur+=Math.random()*3+1;
      if(cur>=100){cur=100;clearInterval(iv);setTimeout(onComplete,800);}
      setPct(Math.min(cur,100));
      setPhase(Math.min(Math.floor(cur/22),phases.length-1));
    },120);
    return ()=>clearInterval(iv);
  },[]);
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
      <Glow color={T.gold} size={400} x="50%" y="50%" op={0.07}/>
      <div style={{textAlign:"center",maxWidth:400}}>
        <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:13,letterSpacing:5,color:T.goldDim,textTransform:"uppercase",marginBottom:48}}>ANALYSE EN COURS</div>
        <div style={{position:"relative",width:120,height:120,margin:"0 auto 48px"}}>
          {[0,1,2].map(i=><div key={i} style={{position:"absolute",inset:-i*16,borderRadius:"50%",border:`1px solid ${T.gold}`,opacity:0.15-i*0.04,animation:`pulse ${1.5+i*0.3}s ease-in-out infinite`}}/>)}
          <div style={{width:"100%",height:"100%",borderRadius:"50%",background:`radial-gradient(circle,rgba(200,169,126,0.2),transparent)`,border:`1px solid ${T.borderGold}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Playfair Display',serif",fontSize:32,color:T.gold}}>◈</div>
        </div>
        <div style={{height:2,background:T.border,borderRadius:1,marginBottom:24,overflow:"hidden"}}>
          <div style={{height:"100%",background:`linear-gradient(90deg,${T.gold},#A8865A)`,width:`${pct}%`,transition:"width 0.15s linear",boxShadow:`0 0 8px ${T.gold}`}}/>
        </div>
        <p style={{fontFamily:"DM Sans,sans-serif",fontSize:14,color:T.muted,minHeight:24}}>{phases[phase]}</p>
        <div style={{fontFamily:"DM Sans,sans-serif",fontSize:28,fontWeight:700,color:T.gold,marginTop:16}}>{Math.floor(pct)}%</div>
      </div>
      <style>{`@keyframes pulse{0%,100%{transform:scale(1);opacity:0.15}50%{transform:scale(1.05);opacity:0.08}}`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// RESULT + PAYWALL
// ═══════════════════════════════════════════════════════════════════════════════
function ResultScreen({dominant,secondary,onUnlock}) {
  const [v,setV]=useState(false);
  const [rev,setRev]=useState(false);
  const [btnH,setBtnH]=useState(false);
  const w=WOUNDS[dominant], sw=WOUNDS[secondary];
  useEffect(()=>{setTimeout(()=>setV(true),100);setTimeout(()=>setRev(true),1800);},[]);
  const rgb=w.color.replace('#','').match(/.{2}/g).map(h=>parseInt(h,16)).join(',');
  return (
    <div style={{minHeight:"100vh",padding:"0 24px",position:"relative"}}>
      <Glow color={w.color} size={500} x="50%" y="25%" op={0.08}/>
      <div style={{maxWidth:560,width:"100%",margin:"0 auto",paddingTop:56,paddingBottom:80}}>
        {/* Wound header */}
        <div style={{opacity:v?1:0,transition:"opacity 0.8s ease 0.2s",marginBottom:28}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:10,padding:"8px 16px",borderRadius:50,background:`rgba(${rgb},0.12)`,border:`1px solid rgba(${rgb},0.3)`,marginBottom:14}}>
            <span style={{fontSize:14,color:w.color}}>{w.icon}</span>
            <span style={{fontFamily:"DM Sans,sans-serif",fontSize:11,color:w.color,letterSpacing:2}}>BLESSURE PRIMAIRE</span>
          </div>
          <h1 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:"clamp(26px,7vw,42px)",fontWeight:700,color:T.cream,lineHeight:1.2,marginBottom:14}}>{w.name}</h1>
          <p style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:17,color:w.color,fontStyle:"italic",lineHeight:1.5}}>"{w.tagline}"</p>
        </div>
        {/* Short desc */}
        <div style={{opacity:rev?1:0,transition:"opacity 0.8s ease",background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:16,padding:22,marginBottom:20}}>
          <p style={{fontFamily:"DM Sans,sans-serif",fontSize:15,color:T.mutedLight,lineHeight:1.85}}>{w.shortDesc}</p>
        </div>
        {/* Secondary */}
        <div style={{opacity:rev?1:0,transition:"opacity 0.8s ease 0.3s",background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:14,padding:18,marginBottom:28,display:"flex",alignItems:"center",gap:14}}>
          <span style={{fontSize:20,color:sw.color}}>{sw.icon}</span>
          <div>
            <div style={{fontFamily:"DM Sans,sans-serif",fontSize:10,color:T.muted,letterSpacing:2,marginBottom:4}}>BLESSURE SECONDAIRE DÉTECTÉE</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,color:T.cream}}>{sw.name}</div>
          </div>
        </div>
        {/* Paywall */}
        <div style={{opacity:rev?1:0,transition:"opacity 0.8s ease 0.6s"}}>
          {/* Blurred preview */}
          <div style={{position:"relative",marginBottom:20,borderRadius:16,overflow:"hidden",border:`1px solid ${T.border}`}}>
            <div style={{padding:"22px",background:T.bgCard,filter:"blur(5px)",userSelect:"none",pointerEvents:"none"}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,color:T.cream,marginBottom:10}}>Comment cette blessure choisit tes partenaires</div>
              <p style={{fontFamily:"DM Sans,sans-serif",fontSize:14,color:T.mutedLight,lineHeight:1.7}}>
                Ta {w.name.toLowerCase()} se manifeste dans 6 domaines précis de ta vie. Dans tes relations amoureuses, elle attire certains profils spécifiques sans que tu t'en rendes compte. Dans le travail, elle crée des comportements répétitifs que tes collègues voient avant toi…
              </p>
            </div>
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(to bottom,transparent 10%,rgba(5,5,8,0.92))"}}>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:22,marginBottom:6}}>🔒</div>
                <div style={{fontFamily:"DM Sans,sans-serif",fontSize:12,color:T.goldDim}}>12 sections verrouillées</div>
              </div>
            </div>
          </div>
          {/* Included */}
          <div style={{background:T.bgElevated,border:`1px solid ${T.borderGold}`,borderRadius:16,padding:22,marginBottom:18}}>
            <div style={{fontFamily:"DM Sans,sans-serif",fontSize:11,color:T.goldDim,letterSpacing:3,marginBottom:16}}>CE QUE LE RAPPORT EXPLIQUE</div>
            {["L'origine exacte de ta blessure selon tes réponses","Comment elle gouverne tes choix amoureux","Ton mécanisme de défense invisible","Ce que tu attires sans t'en rendre compte","Ce que tu confonds avec de l'amour","Un plan de recalibrage sur 7 jours"].map((item,i)=>(
              <div key={i} style={{display:"flex",gap:12,marginBottom:10,alignItems:"flex-start"}}>
                <span style={{color:T.gold,flexShrink:0,marginTop:2}}>✓</span>
                <span style={{fontFamily:"DM Sans,sans-serif",fontSize:14,color:T.mutedLight}}>{item}</span>
              </div>
            ))}
          </div>
          {/* CTA */}
          <div style={{textAlign:"center"}}>
            <div style={{marginBottom:6}}>
              <span style={{fontFamily:"DM Sans,sans-serif",fontSize:13,color:T.muted,textDecoration:"line-through",marginRight:8}}>29,90€</span>
              <span style={{fontFamily:"'Playfair Display',serif",fontSize:30,fontWeight:700,color:T.cream}}>9,90€</span>
            </div>
            <div style={{fontFamily:"DM Sans,sans-serif",fontSize:12,color:T.muted,marginBottom:18}}>Accès illimité · Paiement sécurisé</div>
            <button onClick={onUnlock} onMouseEnter={()=>setBtnH(true)} onMouseLeave={()=>setBtnH(false)}
              style={{width:"100%",background:`linear-gradient(135deg,${T.gold} 0%,#A8865A 100%)`,color:"#050508",border:"none",padding:"20px 32px",borderRadius:50,fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"DM Sans,sans-serif",boxShadow:btnH?`0 0 60px rgba(200,169,126,0.4)`:`0 0 30px rgba(200,169,126,0.2)`,transform:btnH?"scale(1.02)":"scale(1)",transition:"all 0.3s ease"}}>
              Débloquer mon analyse complète →
            </button>
            <p style={{fontFamily:"DM Sans,sans-serif",fontSize:12,color:T.muted,marginTop:10}}>🔒 Paiement sécurisé · Satisfait ou remboursé 7 jours</p>
            <div style={{marginTop:20,padding:16,borderRadius:12,background:T.bgCard,border:`1px solid ${T.border}`,textAlign:"left"}}>
              <div style={{display:"flex",gap:2,marginBottom:8}}>{[...Array(5)].map((_,i)=><span key={i} style={{color:T.gold,fontSize:13}}>★</span>)}</div>
              <p style={{fontFamily:"DM Sans,sans-serif",fontSize:14,color:T.mutedLight,fontStyle:"italic",lineHeight:1.6}}>"C'était exactement moi. J'ai eu un choc en lisant le rapport. Ça m'a donné un vocabulaire pour comprendre ce que je vivais depuis des années."</p>
              <div style={{fontFamily:"DM Sans,sans-serif",fontSize:12,color:T.muted,marginTop:8}}>— Mathilde, 28 ans</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PREMIUM REPORT — 12 sections
// ═══════════════════════════════════════════════════════════════════════════════
function ReportScreen({dominant,secondary,intensity}) {
  const [v,setV]=useState(false);
  useEffect(()=>{setTimeout(()=>setV(true),100);},[]);
  const w=WOUNDS[dominant], sw=WOUNDS[secondary];

  const plan=[
    {day:"Jour 1–2",label:"Nommer",text:`Écris, sans filtre, comment ta ${w.name.toLowerCase()} se manifeste dans ta vie actuelle. Dans quelles relations, dans quels contextes. Nomme des situations concrètes.`},
    {day:"Jour 3",label:"Tracer l'origine",text:"Identifie le premier souvenir où tu as ressenti quelque chose de similaire à ta blessure principale. Pas pour blâmer. Juste pour voir d'où vient le fil."},
    {day:"Jour 4–5",label:"Observer sans réagir",text:"Quand tu sens ta blessure s'activer, pose ta main sur ta poitrine et compte 5 respirations avant de faire quoi que ce soit. Pour créer un espace entre le stimulus et la réponse."},
    {day:"Jour 6",label:"Formuler",text:"Identifie un besoin que tu n'as pas exprimé cette semaine. Formule-le clairement : « J'aurais besoin que tu… » Décide si tu veux le dire."},
    {day:"Jour 7",label:"Recul",text:"Relis ce que tu as écrit en jour 1–2. Qu'est-ce que tu vois maintenant que tu ne voyais pas ? Ce delta — entre avant et après — c'est ta capacité de croissance."},
  ];

  const sections=[
    {title:w.name,sub:"Ta blessure dominante",icon:w.icon,color:w.color,content:`Ce n'est pas une étiquette. C'est un schéma qui s'est installé silencieusement, probablement avant que tu aies les mots pour le nommer. La ${w.name.toLowerCase()} que ton analyse révèle ${intensity==="high"?"est prononcée — elle structure activement tes réactions, tes choix relationnels, et la manière dont tu interprètes le comportement des autres":intensity==="medium"?"est présente avec une intensité significative — elle s'active dans les moments qui comptent":"apparaît dans ton profil de façon notable, principalement dans certains contextes relationnels"}.`},
    {title:"Ce que ton système émotionnel protège",sub:null,icon:"◎",color:null,content:`Derrière chaque blessure, il y a une protection. Ton système émotionnel protège ${w.protects}.\n\nCette protection n'est pas irrationnelle. Elle a une logique parfaite dans le contexte où elle s'est formée. Le problème, c'est qu'elle continue de fonctionner dans des contextes où elle n'est plus nécessaire — et elle a un coût.\n\nComprendre ce que tu protèges, c'est la première étape pour décider si tu veux construire une sécurité différente.`},
    {title:"L'origine probable du schéma",sub:"Pas un diagnostic. Une carte.",icon:"◈",color:null,content:`Ton analyse pointe vers ${w.origin}.\n\nCe n'était pas forcément un traumatisme visible. Parfois, c'est l'absence répétée. Le message implicite reçu des milliers de fois. La manière dont l'amour était distribué — ou retenu. Ton système nerveux a enregistré ce pattern comme une vérité sur le monde et sur toi-même.\n\nCette blessure n'est pas une faiblesse. C'est une adaptation intelligente à un environnement qui ne te donnait pas ce dont tu avais besoin.`},
    {title:"Comment ça se manifeste en amour",sub:null,icon:"◇",color:null,content:w.love},
    {title:"Comment ça se manifeste dans le travail",sub:null,icon:"◉",color:null,content:w.work},
    {title:"Ton mécanisme de défense principal",sub:"Ce que tu fais sans t'en rendre compte",icon:"◆",color:null,content:`Ton mécanisme principal est ${w.defense}.\n\nCe mécanisme fonctionne. C'est pour ça qu'il persiste. Quand tu l'actives, tu te sens momentanément plus en sécurité. Mais il y a un coût systématique : il t'empêche d'accéder à ce dont tu as réellement besoin dans la situation.\n\nLa clé n'est pas de le supprimer — c'est de l'identifier au moment où il s'active. La seconde où tu le vois fonctionner, tu as un choix. Avant, tu n'en as pas.`},
    {title:`Blessure secondaire : ${sw.name}`,sub:"L'empreinte qui amplifie",icon:sw.icon,color:sw.color,content:`Ta blessure secondaire de ${sw.shortName.toLowerCase()} n'est pas indépendante de la première. Elles s'alimentent l'une l'autre selon un schéma précis.\n\nQuand ta blessure de ${w.shortName.toLowerCase()} est activée, tu entres dans un état de protection. C'est là que la blessure de ${sw.shortName.toLowerCase()} prend souvent le relais — elle colore ta réaction, elle amplifie l'interprétation, elle ferme des portes.\n\nComprendre comment ces deux blessures interagissent te donne une carte précieuse.`},
    {title:"Ton paradoxe intérieur",sub:"Ce que tu portes simultanément",icon:"○",color:null,content:`${w.paradox}.\n\nCe paradoxe n'est pas une faiblesse de caractère. C'est la marque d'un système qui essaie de résoudre en une seule vie quelque chose qui a été installé avant que tu aies la capacité de le traiter.\n\nNommer le paradoxe, c'est déjà commencer à en sortir. On ne peut pas choisir autrement ce qu'on ne voit pas.`},
    {title:"Ce que tu attires sans t'en rendre compte",sub:null,icon:"◪",color:null,content:w.attracts},
    {title:"Ce que tu confonds avec de l'amour",sub:null,icon:"◫",color:null,content:w.confuses},
    {title:"Les 3 comportements à observer cette semaine",sub:"Pas des exercices. Des données à collecter.",icon:"◈",color:null,isList:true,items:w.behaviors},
    {title:"Plan de recalibrage sur 7 jours",sub:"Pas de la thérapie. Un point de départ.",icon:"◇",color:null,isPlan:true,planItems:plan},
  ];

  const card={background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:14,padding:"20px 22px"};

  return (
    <div style={{minHeight:"100vh",padding:"0 24px",position:"relative"}}>
      <Glow color={w.color} size={400} x="80%" y="10%" op={0.06}/>
      <div style={{maxWidth:640,width:"100%",margin:"0 auto",paddingTop:56,paddingBottom:80}}>
        <div style={{opacity:v?1:0,transition:"opacity 0.8s ease",marginBottom:44,paddingBottom:28,borderBottom:`1px solid ${T.border}`}}>
          <div style={{fontFamily:"DM Sans,sans-serif",fontSize:11,letterSpacing:4,color:T.goldDim,marginBottom:14}}>RAPPORT PSYCHOLOGIQUE COMPLET</div>
          <h1 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:"clamp(26px,6vw,38px)",fontWeight:700,color:T.cream,lineHeight:1.2,marginBottom:10}}>{w.name}</h1>
          <p style={{fontFamily:"'Playfair Display',serif",fontSize:17,color:w.color,fontStyle:"italic"}}>"{w.tagline}"</p>
        </div>

        {sections.map((s,i)=>(
          <div key={i} style={{marginBottom:36,opacity:v?1:0,transition:`opacity 0.6s ease ${0.1+i*0.06}s`}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
              <span style={{color:s.color||T.gold,fontSize:16}}>{s.icon}</span>
              <div>
                <h2 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:20,fontWeight:700,color:T.cream}}>{s.title}</h2>
                {s.sub&&<p style={{fontFamily:"DM Sans,sans-serif",fontSize:12,color:T.muted,marginTop:2}}>{s.sub}</p>}
              </div>
            </div>
            <div style={card}>
              {s.isList?(
                <div style={{display:"flex",flexDirection:"column",gap:16}}>
                  {s.items.map((item,j)=>(
                    <div key={j} style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                      <span style={{color:T.gold,fontFamily:"'Playfair Display',serif",fontSize:16,flexShrink:0,marginTop:1}}>{j+1}.</span>
                      <p style={{fontFamily:"DM Sans,sans-serif",fontSize:15,color:T.mutedLight,lineHeight:1.8}}>{item}</p>
                    </div>
                  ))}
                </div>
              ):s.isPlan?(
                <div style={{display:"flex",flexDirection:"column",gap:18}}>
                  {s.planItems.map((item,j)=>(
                    <div key={j} style={{display:"flex",gap:16,alignItems:"flex-start"}}>
                      <div style={{flexShrink:0,width:76}}>
                        <div style={{fontFamily:"DM Sans,sans-serif",fontSize:10,color:T.gold,letterSpacing:1,marginBottom:2}}>{item.day}</div>
                        <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,color:T.cream}}>{item.label}</div>
                      </div>
                      <div style={{width:1,background:T.border,flexShrink:0,alignSelf:"stretch"}}/>
                      <p style={{fontFamily:"DM Sans,sans-serif",fontSize:14,color:T.mutedLight,lineHeight:1.75}}>{item.text}</p>
                    </div>
                  ))}
                </div>
              ):(
                s.content.split("\n\n").map((para,j)=>(
                  <p key={j} style={{fontFamily:"DM Sans,sans-serif",fontSize:15,color:T.mutedLight,lineHeight:1.85,marginBottom:j<s.content.split("\n\n").length-1?14:0}}>{para}</p>
                ))
              )}
            </div>
          </div>
        ))}

        <div style={{textAlign:"center",paddingTop:28,borderTop:`1px solid ${T.border}`,opacity:v?1:0,transition:"opacity 0.8s ease 1s"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,letterSpacing:4,color:T.goldDim,marginBottom:10}}>M I N D W E L L</div>
          <p style={{fontFamily:"DM Sans,sans-serif",fontSize:12,color:T.muted}}>Ce rapport est généré sur la base de tes réponses et ne constitue pas un diagnostic médical ou psychologique.</p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [screen,setScreen]=useState("landing");
  const [qIndex,setQIndex]=useState(0);
  const [answers,setAnswers]=useState([]);
  const [selected,setSelected]=useState(null);
  const [result,setResult]=useState(null);

  const handleAnswer=useCallback((idx)=>{
    setSelected(idx);
    setTimeout(()=>{
      const next=[...answers,idx];
      setAnswers(next); setSelected(null);
      if(qIndex+1>=QUESTIONS.length){setResult(calculateScores(next));setScreen("loading");}
      else setQIndex(qIndex+1);
    },420);
  },[answers,qIndex]);

  return (
    <div style={{background:T.bg,minHeight:"100vh",color:T.cream,position:"relative",overflowX:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@400;500;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:#050508;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:#050508;}
        ::-webkit-scrollbar-thumb{background:#1E1E2A;border-radius:2px;}
        button{-webkit-tap-highlight-color:transparent;}
      `}</style>
      <NeuralBackground/>
      <div style={{position:"relative",zIndex:1}}>
        {screen==="landing"&&<LandingScreen onStart={()=>setScreen("quiz")}/>}
        {screen==="quiz"&&<QuizScreen question={QUESTIONS[qIndex]} qIndex={qIndex} total={QUESTIONS.length} onAnswer={handleAnswer} selected={selected}/>}
        {screen==="loading"&&<LoaderScreen onComplete={()=>setScreen("result")}/>}
        {screen==="result"&&result&&<ResultScreen dominant={result.dominant} secondary={result.secondary} onUnlock={()=>setScreen("report")}/>}
        {screen==="report"&&result&&<ReportScreen dominant={result.dominant} secondary={result.secondary} intensity={result.intensity}/>}
      </div>
    </div>
  );
}
