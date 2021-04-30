import * as React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Heading from './Heading';
import Button from './Button';
import Modal from './Modal';
import {Dispatch, RootState} from '../store';
import useManageTokens from '../store/useManageTokens';
import Tooltip from './Tooltip';
import Icon from './Icon';

function ImportToken({
    name,
    value,
    oldValue,
    description,
    oldDescription,
    updateAction,
    removeToken,
    updateToken,
}: {
    name: string;
    value: string;
    oldValue?: string;
    description?: string;
    oldDescription?: string;
    updateAction: string;
    removeToken: any;
    updateToken: any;
}) {
    return (
        <div className="flex justify-between">
            <div>
                <div className="font-semibold text-sm">{name}</div>
                <div className="text-xs text-gray-600">
                    {value} {oldValue ? ` (before: ${oldValue})` : ''}
                </div>
                {(description || oldDescription) && (
                    <div className="text-xxs">
                        {description} {oldDescription ? ` (before: ${oldDescription})` : ''}
                    </div>
                )}
            </div>
            <div className="flex flex-row items-center space-x-1">
                <Tooltip variant="right" label={updateAction}>
                    <button className="button button-ghost" type="button" onClick={updateToken}>
                        <Icon name="add" />
                    </button>
                </Tooltip>
                <Tooltip variant="right" label="Ignore">
                    <button className="button button-ghost" type="button" onClick={removeToken}>
                        <Icon name="trash" />
                    </button>
                </Tooltip>
            </div>
        </div>
    );
}

export default function ImportedTokensDialog() {
    const dispatch = useDispatch<Dispatch>();
    const {editSingleToken, createSingleToken} = useManageTokens();
    const {importedTokens, activeTokenSet} = useSelector((state: RootState) => state.tokenState);
    const [newTokens, setNewTokens] = React.useState(importedTokens.newTokens);
    const [updatedTokens, setUpdatedTokens] = React.useState(importedTokens.updatedTokens);

    const handleCreateNewClick = () => {
        // Create new tokens according to styles
        newTokens.forEach((token) => {
            createSingleToken({
                parent: activeTokenSet,
                name: token.name,
                value: token.value,
                options: {
                    type: token.type,
                    description: token.description,
                },
            });
            setNewTokens(newTokens.filter((t) => t.name !== token.name));
        });
    };

    const handleUpdateClick = () => {
        // Go through each token that needs to be updated
        importedTokens.updatedTokens.forEach((token) => {
            editSingleToken({
                parent: activeTokenSet,
                name: token.name,
                value: token.value,
                options: {
                    type: token.type,
                    description: token.description,
                },
            });
            setUpdatedTokens(updatedTokens.filter((t) => t.name !== token.name));
        });
    };

    const handleCreateSingleClick = (token) => {
        // Create new tokens according to styles
        createSingleToken({
            parent: activeTokenSet,
            name: token.name,
            value: token.value,
            options: {
                type: token.type,
                description: token.description,
            },
        });
        setNewTokens(newTokens.filter((t) => t.name !== token.name));
    };

    const handleUpdateSingleClick = (token) => {
        // Go through each token that needs to be updated
        editSingleToken({
            parent: activeTokenSet,
            name: token.name,
            value: token.value,
            options: {
                type: token.type,
                description: token.description,
            },
        });
        setUpdatedTokens(updatedTokens.filter((t) => t.name !== token.name));
    };

    const handleClose = () => {
        dispatch.tokenState.resetImportedTokens();
    };

    React.useEffect(() => {
        setNewTokens(importedTokens.newTokens);
        setUpdatedTokens(importedTokens.updatedTokens);
        console.log('Updated!', importedTokens.newTokens, importedTokens.newTokens.length);
    }, [importedTokens.newTokens, importedTokens.updatedTokens]);

    if (!newTokens.length && !updatedTokens.length) return null;

    return (
        <Modal large showClose isOpen={newTokens.length > 0 || updatedTokens.length > 0} close={handleClose}>
            <div className="space-y-8">
                {newTokens.length > 0 && (
                    <div>
                        <div className="flex justify-between items-center">
                            <Heading>New Tokens</Heading>
                            <Button variant="secondary" id="button-import-create-all" onClick={handleCreateNewClick}>
                                Create all
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {newTokens.map((token) => {
                                return (
                                    <ImportToken
                                        key={token.name}
                                        name={token.name}
                                        value={token.value}
                                        description={token.description}
                                        updateAction="Create"
                                        removeToken={() => setNewTokens(newTokens.filter((t) => t.name !== token.name))}
                                        updateToken={() => handleCreateSingleClick(token)}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
                {updatedTokens.length > 0 && (
                    <div>
                        <div className="flex justify-between">
                            <Heading>Existing tokens</Heading>
                            <Button variant="secondary" id="button-import-update-all" onClick={handleUpdateClick}>
                                Update all
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {updatedTokens.map((token) => {
                                return (
                                    <ImportToken
                                        key={token.name}
                                        name={token.name}
                                        value={token.value}
                                        oldValue={token.oldValue}
                                        description={token.description}
                                        oldDescription={token.oldDescription}
                                        updateAction="Update"
                                        removeToken={() =>
                                            setUpdatedTokens(updatedTokens.filter((t) => t.name !== token.name))
                                        }
                                        updateToken={() => handleUpdateSingleClick(token)}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
                <Button variant="secondary" id="button-import-close" onClick={handleClose}>
                    Cancel
                </Button>
            </div>
        </Modal>
    );
}