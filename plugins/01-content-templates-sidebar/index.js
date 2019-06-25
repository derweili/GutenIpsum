const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { PanelBody, PanelRow, Button, Modal, TextControl, RadioControl, ClipboardButton, Snackbar } = wp.components;
const { registerPlugin } = wp.plugins;
const { PluginSidebar, PluginSidebarMoreMenuItem } = wp.editPost;
const { select, dispatch} = wp.data;
const apiRequest = wp.apiRequest;
const ajax= wp.ajax;

const {createBlock, rawHandler} = wp.blocks;

import { loremIpsum } from "lorem-ipsum";

import "./plugin.scss";

/**
 * 
 */

class GutenIpsumSidebar extends React.Component {

    state = {
        text: '',                // generated Lorem Ipsum Text
        hasCopied: false,        // store if text was copied
        units: "sentences",      // paragraph(s), "sentence(s)", or "word(s)"
        count: 3,                // Number of "words", "sentences", or "paragraphs"
        paragraphLowerBound: 3,  // Min. number of sentences per paragraph.
        paragraphUpperBound: 7,  // Max. number of sentences per paragarph.
        random: Math.random,     // A PRNG function
        sentenceLowerBound: 5,   // Min. number of words per sentence.
        sentenceUpperBound: 15,  // Max. number of words per sentence.
    };

    /**
     * Auto Generate Lorem Ipsum Text on Component Mount for the first time
     */
    componentDidMount(){
        const text = this.createLoremIpsum();
        this.setState({text});
    }

    /**
     * Create Lorem Ipsum text based on state and store text in state
     */
    createLoremIpsum(){
        const { units, count, paragraphLowerBound, paragraphUpperBound, sentenceLowerBound, sentenceUpperBound} = this.state;
        const text = loremIpsum({
            units,
            count: count,
            format: "html",
            paragraphLowerBound: paragraphLowerBound <= paragraphUpperBound ? paragraphLowerBound : paragraphUpperBound,
            paragraphUpperBound: paragraphUpperBound >= paragraphLowerBound ? paragraphUpperBound : paragraphLowerBound,
            sentenceLowerBound: sentenceLowerBound <= sentenceUpperBound ? sentenceLowerBound : sentenceUpperBound,
            sentenceUpperBound: sentenceUpperBound >= sentenceLowerBound ? sentenceUpperBound : sentenceLowerBound,
        });
        return text;
    }

    /**
     * Insert Text into Editor
     * 
     * @param {string} text Text as HTML to insert
     */
    onInstertContent( text ){
        var gutblock = wp.blocks.rawHandler({ 
            HTML:  text,
        });

        // insert new Blocks
        dispatch("core/editor").insertBlocks(gutblock);

    }

    /**
     * Set state middleware to auto generate Lorem Ipsum text after state change of properties
     * 
     * @param {object} values state object that should be parsed to setState
     */
    onChangeValues( values ){
        this.setState( values, () => {
            const text = this.createLoremIpsum();
            this.setState({text});
        })
    }

    render(){

        const {
            units, 
            isOpen, 
            count, 
            hasCopied, 
            text, 
            paragraphLowerBound, 
            paragraphUpperBound,
            sentenceLowerBound,
            sentenceUpperBound
        } = this.state;
          
        return (
            <Fragment>
                <PluginSidebarMoreMenuItem target="gutenipsum-sidebar">
                    {__("GutenIpsum", "gutenipsum")}
                </PluginSidebarMoreMenuItem>
                <PluginSidebar
                    name="gutenipsum-sidebar"
                    title={__("GutenIpsum", "gutenipsum")}
                >
                    <PanelBody title={__("Generate Lorem Ipsum Text", "gutenipsum")} opened>
                        <PanelRow>
                            <RadioControl
                                label={__("Unit", "gutenipsum")}
                                help=""
                                selected={ units }
                                options={ [
                                    { label: __("Words", "gutenipsum"), value: 'words' },
                                    { label: __("Sentences", "gutenipsum"), value: 'sentences' },
                                    { label: __("Paragraphs", "gutenipsum"), value: 'paragraphs' },
                                ] }
                                onChange={ ( units ) => { this.onChangeValues( { units } ) } }
                            />
                      </PanelRow>
                      <PanelRow>
                            <TextControl
                                label={` Number of ${units}` }
                                value={ count }
                                type="number"
                                min="1"
                                onChange={ ( number ) => {this.onChangeValues( { count: parseInt(number) } )} }
                            />
                      </PanelRow>
                      <PanelRow>
                        <ClipboardButton
                            isDefault
                            isLarge
                            text={text}
                            onCopy={ () => this.setState( { hasCopied: true } ) }
                            onFinishCopy={ () => this.setState( { hasCopied: false } ) }
                        >
                            { hasCopied ? __("Copied!", "gutenipsum") : __("Copy to Clipboard", "gutenipsum") }
                        </ClipboardButton>
                      </PanelRow>
                      <PanelRow>
                        <Button
                            isDefault
                            onClick={ () => { this.onInstertContent( text ) } }
                        >
                            {__("Insert into Content", "gutenipsum")}
                        </Button>
                      </PanelRow>
                    </PanelBody>
                    <PanelBody title={__("Advanced Settings", "gutenipsum")} initialOpen={ false } >
                        <PanelRow>
                            <TextControl
                                label={__("Min. number of sentences per paragraph.", "gutenipsum")}
                                value={ paragraphLowerBound }
                                type="number"
                                min="1"
                                max={ paragraphUpperBound }
                                onChange={ ( paragraphLowerBound ) => {this.onChangeValues( { paragraphLowerBound: parseInt(paragraphLowerBound) } )} }
                                />
                        </PanelRow>
                        <PanelRow>
                            <TextControl
                                label={__("Max. number of sentences per paragarph.", "gutenipsum")}
                                value={ paragraphUpperBound }
                                type="number"
                                min={ paragraphLowerBound }
                                onChange={ ( paragraphUpperBound ) => {this.onChangeValues( { paragraphUpperBound: parseInt(paragraphUpperBound) } )} }
                                />
                        </PanelRow>
                        <PanelRow>
                            <TextControl
                                label={__("Min. number of words per sentence.", "gutenipsum")}
                                value={ sentenceLowerBound }
                                type="number"
                                min="1"
                                max={sentenceUpperBound}
                                onChange={ ( sentenceLowerBound ) => {this.onChangeValues( { sentenceLowerBound: parseInt(sentenceLowerBound) } )} }
                                />
                        </PanelRow>
                        <PanelRow>
                            <TextControl
                                label={__("Max. number of words per sentence.", "gutenipsum")}
                                value={ sentenceUpperBound }
                                type="number"
                                min={sentenceLowerBound}
                                onChange={ ( sentenceUpperBound ) => {this.onChangeValues( { sentenceUpperBound: parseInt(sentenceUpperBound) } )} }
                                />
                        </PanelRow>
                        
                    </PanelBody>
                    <PanelBody title={__("Lorem Ipsum", "gutenipsum")} opened>
                        <div dangerouslySetInnerHTML={ { __html : text } }></div>
                    </PanelBody>
                </PluginSidebar>
            </Fragment>
        )
    }
}

registerPlugin( "gutenipsum-sidebar", {
    icon: "editor-alignleft",
    render: GutenIpsumSidebar
})