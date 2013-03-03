SRC = $(wildcard lib/*/*.js)
JSON = $(wildcard lib/*/component.json)

build: components $(SRC)
	@npm install
	@./lib/build/builder

components: component.json $(JSON)
	@component install

minify: minify-js

minify-js: build/build.js
	curl -s \
		-d compilation_level=SIMPLE_OPTIMIZATIONS \
		-d output_format=text \
		-d output_info=compiled_code \
		--data-urlencode "js_code@$<" \
		http://closure-compiler.appspot.com/compile \
		> $<.tmp
	mv $<.tmp $<

clean:
	rm -fr build components node_modules

.PHONY: build clean minify
