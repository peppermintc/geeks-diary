import {
    async,
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';
import { KeyCodes } from '../../../../common/key-codes';
import { dispatchKeyboardEvent } from '../../../../testing';
import {
    NOTE_EDITOR_SNIPPET_CONFIG,
    NOTE_EDITOR_SNIPPET_REF,
    NoteEditorSnippetConfig,
    NoteEditorSnippetEvent,
    NoteEditorSnippetEventNames,
    NoteEditorSnippetRef,
} from './snippet';
import { NoteCodeEditorSnippetComponent } from './code-snippet.component';


describe('app.note.editor.snippet.NoteCodeEditorSnippetComponent', () => {
    let fixture: ComponentFixture<NoteCodeEditorSnippetComponent>;
    let component: NoteCodeEditorSnippetComponent;

    let ref: NoteEditorSnippetRef;
    let config: NoteEditorSnippetConfig;

    const getInputField = (): HTMLTextAreaElement =>
        document.querySelector('.monaco-editor .inputarea');

    beforeEach(() => {
        ref = new NoteEditorSnippetRef();
        config = {
            initialValue: 'initial value',
            language: 'javascript',
        };
    });

    beforeEach(async(() => {
        TestBed
            .configureTestingModule({
                providers: [
                    { provide: NOTE_EDITOR_SNIPPET_REF, useValue: ref },
                    { provide: NOTE_EDITOR_SNIPPET_CONFIG, useValue: config },
                ],
                declarations: [NoteCodeEditorSnippetComponent],
            })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NoteCodeEditorSnippetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        if (component.contentEl) {
            component.contentEl.nativeElement.remove();
        }
    });

    describe('initialize', () => {
        it('should show initial value when initialized editor.', () => {
            expect(component.getValue()).toEqual(config.initialValue);
        });

        it('should language has been set.', () => {
            expect(component.getLanguage()).toEqual(config.language);
        });
    });

    describe('isCurrentPositionTop(): boolean', () => {
        it('should be true when cursor in the start line of editor.', () => {
            component._editor.setPosition({
                lineNumber: 1,
                column: 0,
            });

            expect(component.isCurrentPositionTop()).toBe(true);
        });
    });

    describe('isCurrentPositionBottom(): boolean', () => {
        it('if editor has only one line, it should be true on both top and bottom.', () => {
            expect(component.isCurrentPositionTop()).toBe(true);
            expect(component.isCurrentPositionBottom()).toBe(true);
        });

        it('should be true when cursor in the last line of editor', () => {
            component.setValue('hello\nworld!');
            component._editor.setPosition({
                lineNumber: 2,
                column: 0,
            });

            expect(component.isCurrentPositionBottom()).toBe(true);
        });
    });

    describe('setPositionToTop(): void', () => {
        it('should cursor located at first line.', () => {
            component.setValue('Some long\nparagraph');
            component._editor.setPosition({
                lineNumber: 2,
                column: 0,
            });
            expect(component.isCurrentPositionTop()).toBe(false);

            component.setPositionToTop();
            expect(component.isCurrentPositionTop()).toBe(true);
        });
    });

    describe('setPositionToBottom(): void', () => {
        it('should cursor located at last line.', () => {
            component.setValue('Some long\nparagraph.');
            expect(component.isCurrentPositionBottom()).toBe(false);

            component.setPositionToBottom();
            expect(component.isCurrentPositionBottom()).toBe(true);
        });
    });

    describe('typing', () => {
        it('should fire \'REMOVE_THIS\' event when press a backspace with a blank value', () => {
            const inputField = getInputField();
            const eventCallback = jasmine.createSpy('eventCallback');

            component.setValue('');
            component._ref.events().subscribe(eventCallback);

            dispatchKeyboardEvent(inputField, 'keydown', KeyCodes.BACKSPACE);

            expect(eventCallback).toHaveBeenCalledWith(new NoteEditorSnippetEvent(
                NoteEditorSnippetEventNames.REMOVE_THIS, component._ref));
        });

        it('should fire \'MOVE_FOCUS_TO_PREVIOUS\' event when press a up arrow ' +
            'and current cursor in top of lines.', () => {

            const inputField = getInputField();
            const eventCallback = jasmine.createSpy('eventCallback');

            component.setPositionToTop();
            component._ref.events().subscribe(eventCallback);

            dispatchKeyboardEvent(inputField, 'keydown', KeyCodes.UP_ARROW);

            expect(eventCallback).toHaveBeenCalledWith(new NoteEditorSnippetEvent(
                NoteEditorSnippetEventNames.MOVE_FOCUS_TO_PREVIOUS, component._ref));
        });

        it('should fire \'MOVE_FOCUS_TO_NEXT\' event when press a down arrow ' +
            'and current cursor in bottom of lines.', () => {

            const inputField = getInputField();
            const eventCallback = jasmine.createSpy('eventCallback');

            component.setPositionToBottom();
            component._ref.events().subscribe(eventCallback);

            dispatchKeyboardEvent(inputField, 'keydown', KeyCodes.DOWN_ARROW);

            expect(eventCallback).toHaveBeenCalledWith(new NoteEditorSnippetEvent(
                NoteEditorSnippetEventNames.MOVE_FOCUS_TO_NEXT, component._ref));
        });
    });
});
