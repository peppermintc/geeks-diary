export class NoteMetadata {
    readonly id: string;
    readonly title: string;
    readonly stacks: string[];
    readonly createdDatetime: number;
    readonly updatedDatetime: number | null;
    noteFileName?: string;
    fileName?: string;

    static applyPatch(
        original: NoteMetadata,
        patch: Partial<NoteMetadata>,
    ): NoteMetadata {

        return {
            ...original,
            ...patch,
        };
    }

    static convertToFileData(metadata: NoteMetadata): string {
        return JSON.stringify({
            id: metadata.id,
            title: metadata.title,
            stacks: metadata.stacks,
            createdDatetime: metadata.createdDatetime,
            updatedDatetime: metadata.updatedDatetime,
        });
    }
}


export enum NoteContentSnippetTypes {
    CODE = 'code',
    TEXT = 'text',
}


export class NoteContentSnippet {
    readonly id: string;
    readonly type: NoteContentSnippetTypes;
    readonly value: string;
    readonly language?: string;
    readonly fileName?: string;
}


export class NoteContent {
    readonly noteId: string;
    readonly title: string;
    readonly stacks: string[];
    readonly snippets: NoteContentSnippet[];
    noteFileName?: string;
    fileName?: string;

    static applyPatch(
        original: NoteContent,
        patch: Partial<NoteContent>,
    ): NoteContent {

        return {
            ...original,
            ...patch,
        };
    }

    static convertToFileData(content: NoteContent): string {
        return JSON.stringify({
            noteId: content.noteId,
            title: content.title,
            stacks: content.stacks,
            snippets: content.snippets,
        });
    }

    static convertToPreviewString(content: NoteContent): string {
        let str = '';

        content.snippets.forEach((snippet) => {
            switch (snippet.type) {
                case NoteContentSnippetTypes.TEXT:
                    str += snippet.value;
                    break;

                case NoteContentSnippetTypes.CODE:
                    str += `\`\`\`${snippet.language}`;
                    str += '\n';
                    str += snippet.value;
                    str += '\n';
                    str += '\`\`\`';
            }

            str += `\n\n`;
        });

        return str;
    }
}


export enum NoteFinderDateFilterTypes {
    MONTH = 'MONTH',
    DATE = 'DATE',
}


export enum NoteFinderSortTypes {
    TITLE = 'TITLE',
    CREATED = 'CREATED',
    UPDATED = 'UPDATED',
}


export enum NoteFinderSortDirection {
    ASC = 'ASC',
    DESC = 'DESC',
}


export enum NoteEditorViewModes {
    SHOW_BOTH = 'SHOW_BOTH',
    EDITOR_ONLY = 'EDITOR_ONLY',
    PREVIEW_ONLY = 'PREVIEW_ONLY',
}
