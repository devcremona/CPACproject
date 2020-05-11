# Modules usage #

## story.js ##
STATUS_STORY_ENUM is an enumerator to know the flow of the story
STATUS_RECAP_ENUM is an enumerator to know the flow of the recap

In order set correctly the story use functions in this order:

* s = getCurrentStatus()

* n = getNarration()

* c = getChoices()

* setUserChoice(status, object)

* s = setNextStatus_Story()

See functions documentation directly in the js code

Other functions this submodule exhibits:

* s = setNextStatus_Recap()

* bool = isAutomaticStoryAhead(status)

* c = getUserChoice(status)

* n = getNarrationRecap()

## narration.js ##
This submodule exhibits these functions: 
* getVoices()

* setVoice("name", rate=0.7, pitch=1, volume=1)

* speak("textmsg")

* speakStop()
