var Checker = require('../lib/checker');
var assert = require('assert');

describe('modules/string-checker', function() {
    describe('line srating with hash, temporary, until we will have inline rules', function() {
        var checker;
        beforeEach(function() {
            checker = new Checker();
            checker.registerDefaultRules();
        });

        it('should ignore lines starting with #!', function() {
            assert(checker.checkString(
                '#! random stuff\n' +
                '#! 1234\n' +
                'var a = 5;\n'
            ).isEmpty());
        });
        it('should ignore ios instruments style import', function() {
            assert(checker.checkString(
                '#import "abc.js"\n' +
                '#import abc.js\n' +
                'var a = 5;\n'
            ).isEmpty());
        });
        it('should not replace when not beginning of line', function() {
            checker.configure({ disallowMultipleLineStrings: true });
            assert(checker.checkString(
                '#import "abc.js"\n' +
                'var b="#import \\\n abc.js";\n' +
                'var a = 5;\n'
            ).getErrorCount() === 1);
        });
    });

    it('should not process the rule if it is equals to null (#203)', function() {
        var checker = new Checker();
        checker.registerDefaultRules();

        try {
            checker.configure({
                preset: 'jquery',
                requireCurlyBraces: null
            });
            assert(true);
        } catch (_) {
            assert(false);
        }
    });
    it('should throw if preset does not exist', function() {
        var checker = new Checker();

        checker.registerDefaultRules();

        try {
            checker.configure({
                preset: 'not-exist'
            });

            assert(false);
        } catch (e) {
            assert(e.toString() === 'Error: Preset "not-exist" does not exist');
        }
    });

    describe('rules registration', function() {
        var checker;
        beforeEach(function() {
            checker = new Checker();
            checker.registerDefaultRules();
        });
        it('should report rules in config which don\'t match any registered rules', function() {
            var error;
            try {
                checker.configure({ disallowMulipleLineBreaks: true, disallowMultipleVarDelc: true });
            } catch (e) {
                error = e;
            }
            assert.equal(
                error.message,
                'Unsupported rules: disallowMulipleLineBreaks, disallowMultipleVarDelc'
            );
        });
        it('should not report rules in config which match registered rules', function() {
            var error;
            try {
                checker.configure({ disallowMultipleLineBreaks: true, disallowMultipleVarDecl: true });
            } catch (e) {
                error = e;
            }
            assert(error === undefined);
        });
        it('should not report "excludeFiles" rule as unregistered', function() {
            var error;
            try {
                checker.configure({ excludeFiles: [] });
            } catch (e) {
                error = e;
            }
            assert(error === undefined);
        });
    });
});
