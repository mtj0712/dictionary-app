import "./style.css";

const dictionaryAPI = "https://api.dictionaryapi.dev/api/v2/entries/en_US/";

const searchWord = async (word) => {
  const response = await fetch(`${dictionaryAPI}${word}`);
  if (!response.ok) {
    throw new Error(`Word not found (status ${response.status})`);
  }
  return response.json();
};

const extractFromEntry = (data, key) => {
  if (data && Array.isArray(data)) {
    return data[0][key];
  }
};

const clearDefinitionsSection = () => {
  const definitionsSection = document.getElementById("definitions");
  definitionsSection.innerHTML = "";
  return definitionsSection;
};

const createDefinitionsHeading = () => {
  const definitionsHeading = document.createElement("h1");
  definitionsHeading.classList.add("text-2xl", "font-semibold");
  definitionsHeading.innerText = "Definitions";
  return definitionsHeading;
};

const createDefinitionDiv = () => {
  const definitionDiv = document.createElement("div");
  definitionDiv.classList.add("bg-sky-50");
  return definitionDiv;
};

const createPartOfSpeechElement = (partOfSpeech) => {
  const partOfSpeechName = document.createElement("p");
  partOfSpeechName.classList.add(
    "px-4",
    "py-2",
    "font-semibold",
    "text-white",
    "bg-sky-600",
  );
  partOfSpeechName.innerText = partOfSpeech;
  return partOfSpeechName;
};

const createDefinitionsList = () => {
  const definitionsList = document.createElement("ul");
  definitionsList.classList.add(
    "p-2",
    "ml-6",
    "font-light",
    "list-disc",
    "text-sky-700",
  );
  return definitionsList;
};

const createDefinitionItem = (definitionObj) => {
  const definitionsItem = document.createElement("li");
  definitionsItem.innerText = definitionObj.definition;
  return definitionsItem;
};

const displayWordDefinition = (meanings) => {
  const definitionsSection = clearDefinitionsSection();

  const definitionsHeading = createDefinitionsHeading();
  definitionsSection.appendChild(definitionsHeading);

  meanings.forEach((meaning) => {
    const definitionDiv = createDefinitionDiv();
    definitionsSection.appendChild(definitionDiv);

    const { partOfSpeech, definitions } = meaning;

    const partOfSpeechName = createPartOfSpeechElement(partOfSpeech);
    definitionDiv.appendChild(partOfSpeechName);

    const definitionsList = createDefinitionsList();
    definitionDiv.appendChild(definitionsList);

    const definitionListItems = definitions.map(createDefinitionItem);
    definitionsList.append(...definitionListItems);
  });
};

const createPhoneticsSection = () => {
  const phoneticsSection = document.getElementById("phonetics");
  phoneticsSection.innerHTML = "";
  phoneticsSection.classList.add("flex", "flex-col", "gap-4");
  return phoneticsSection;
};

const createPhoneticsHeading = () => {
  const phoneticsHeading = document.createElement("h1");
  phoneticsHeading.classList.add("text-2xl", "font-semibold");
  phoneticsHeading.innerText = "Phonetics";
  return phoneticsHeading;
};

const createPhoneticsDiv = () => {
  const phoneticsDiv = document.createElement("div");
  phoneticsDiv.classList.add("bg-stone-100");
  return phoneticsDiv;
};

const createPhoneticElement = (text) => {
  const phoneticText = document.createElement("p");
  phoneticText.classList.add("px-4", "py-3", "text-white", "bg-stone-700");
  phoneticText.innerText = text;
  return phoneticText;
};

const createAudioControl = () => {
  const audioControl = document.createElement("audio");
  audioControl.style = "width: 100%";
  audioControl.setAttribute("controls", "true");
  return audioControl;
};

const createAudioSource = (audio) => {
  const source = document.createElement("source");
  source.setAttribute("src", audio);
  source.setAttribute("type", "audio/mpeg");
  return source;
};

const displayWordPhonetic = (phonetics) => {
  const phoneticsSection = createPhoneticsSection();

  const phoneticsHeading = createPhoneticsHeading();
  phoneticsSection.appendChild(phoneticsHeading);

  phonetics.forEach((phonetic) => {
    const { text, audio } = phonetic;

    if (!text || !audio) return;

    const phoneticsDiv = createPhoneticsDiv();
    phoneticsSection.appendChild(phoneticsDiv);

    const phoneticText = createPhoneticElement(text);
    phoneticsDiv.appendChild(phoneticText);

    const audioControl = createAudioControl();
    phoneticsDiv.appendChild(audioControl);

    const source = createAudioSource(audio);
    audioControl.appendChild(source);

    audioControl.appendChild(
      document.createTextNode(
        "Your browser does not support the audio element.",
      ),
    );
  });
};

const displayError = (message) => {
  const definitionsSection = clearDefinitionsSection();
  const error = document.createElement("p");
  error.classList.add("p-4", "text-red-600", "font-semibold");
  error.innerText = message;
  definitionsSection.appendChild(error);
};

const inputWord = document.getElementById("input");
const submitBtn = document.getElementById("submit");
submitBtn.addEventListener("click", async () => {
  const word = inputWord.value.trim();
  if (!word) return;

  try {
    const data = await searchWord(word);
    const meanings = extractFromEntry(data, "meanings");
    displayWordDefinition(meanings);
    const phonetics = extractFromEntry(data, "phonetics");
    displayWordPhonetic(phonetics);
  } catch (error) {
    displayError("Could not find the word. Please try another.");
  }
});
