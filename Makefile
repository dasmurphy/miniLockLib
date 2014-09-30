default: miniLockLib.js website/miniLockLib.js website/tests.js website/annotated_code.js website/index.js

# Create a standalone copy of miniLockLib.js at project root.
miniLockLib.js: website/miniLockLib.js
	cp website/miniLockLib.js miniLockLib.js

# Create a standalone copy of miniLockLib.js in the website folder.
website/miniLockLib.js: library/%.coffee library.compiled/scrypt-async.js library.compiled/zxcvbn.js
	browserify library.compiled/index.js --standalone miniLockLib > website/miniLockLib.js

# Compile CoffeeScript library files to the library.compiled folder.
library/%.coffee: library.compiled
	coffee --compile --output library.compiled library/*.coffee

# Folder for compiled Javascript files that form the library.
library.compiled:
	mkdir -p library.compiled

# Download scrypt-async.js and save it in the library.compiled folder.
library.compiled/scrypt-async.js:
	curl -s https://raw.githubusercontent.com/dchest/scrypt-async-js/master/scrypt-async.js \
		> library.compiled/scrypt-async.js

# Make a copy of zxcvbn.js that exports itself as a module.
library.compiled/zxcvbn.js:
	cat node_modules/zxcvbn/zxcvbn.js \
		| sed "s/window.zxcvbn=o/module.exports=o/" \
		> library.compiled/zxcvbn.js

# Create annotated_code.js in the website folder.
website/annotated_code.js: website/annotated_code.coffee
	coffee --compile website/annotated_code.coffee

# Create index.js in the website folder.
website/index.js: website/index.coffee
	coffee --compile website/index.coffee

# Create tests.js in the website folder.
website/tests.js: tests/%.coffee
	browserify --debug tests.compiled/*.js > website/tests.js

# Compile CoffeeScript tests to the tests.compiled folder.
tests/%.coffee: tests.compiled
	coffee --output tests.compiled --compile tests/*.coffee

# Folder for compiled tests.
tests.compiled:
	mkdir -p tests.compiled

# Remove all compiled Javascript code and annotated code pages.
clean:
	rm -f library.compiled/*.js
	rm -f tests.compiled/*.js
	rm -f website/miniLockLib.js website/tests.js website/annotated_code.js website/index.js
	rm -rf website/annotated_code

# Setup POW to serve http://minilocklib.dev/
install:
	mkdir ~/.pow/minilocklib
	ln -s $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))/website ~/.pow/minilocklib/public

# Remove POW file.
uninstall:
	rm -rf ~/.pow/minilocklib

gh-pages:
	git checkout master
	mkdir -p gh-pages
	cp -r website/* gh-pages
	git checkout gh-pages
	rm -f *.html *.js *.css
	cp -r gh-pages/* ./
	git add --all
	git status
	git commit -m "Updated pages."
	git status
	rm -rf gh-pages
	git checkout master
