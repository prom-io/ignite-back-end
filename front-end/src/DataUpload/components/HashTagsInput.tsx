import React, {FunctionComponent, Fragment, useState} from "react";
import {TextField, Chip, IconButton, InputAdornment} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

interface HashTagsInput {
    tags?: string[],
    onHashTagAdded: (tag: string) => void,
    onHashTagRemoved: (tagIndex: number) => void
}

export const HashTagsInput: FunctionComponent<HashTagsInput> = ({
    tags,
    onHashTagAdded,
    onHashTagRemoved
}) => {
    const [tagText, setTagText] = useState<string>("");

    const handleHashTagAdded = (): void => {
        onHashTagAdded(tagText);
        setTagText("");
    };
    const handleHashTagRemoved = (index: number): void => onHashTagRemoved(index);

    return (
        <Fragment>
            <TextField label="Tag"
                       fullWidth
                       margin="dense"
                       value={tagText}
                       onChange={event => setTagText(event.target.value)}
                       InputProps={{
                           endAdornment: (tagText.length !== 0 &&
                               <InputAdornment position="end">
                                   <IconButton onClick={handleHashTagAdded}>
                                       <AddIcon/>
                                   </IconButton>
                               </InputAdornment>
                           )
                       }}
            />
            {tags && tags.map((tag, index) => (
                <Chip key={index}
                      onDelete={() => handleHashTagRemoved(index)}
                      label={tag}
                />
            ))}
        </Fragment>
    )
};
