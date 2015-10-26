/**
 * Created by brad.wu on 8/24/2015.
 */
var validator = $pt.createModelValidator({
    name: {
        length: 5
    }
});

var model = $pt.createModel({
    name: 'abc'
}, validator);

// normal validation
model.validate('name');
console.log('1st Validation:');
console.log('Model has error: ' + model.hasError());
console.log(model.getError('name'));

validator = $pt.createModelValidator({
    name: {
        length: {
            _when: function (model) {
                return model.get('code') == 'a';
            },
            rule: 5
        }
    }
});
model = $pt.createModel({
    name: 'abc',
    code: 'a'
}, validator);

// when is true
model.validate('name');
console.log('2nd Validation:');
console.log('Model has error: ' + model.hasError());
console.log(model.getError('name'));

// when is false
model.set('code', 'b');
model.validate('name');
console.log('3rd Validation:');
console.log('Model has error: ' + model.hasError());
console.log(model.getError('name'));

validator = $pt.createModelValidator({
    name: {
        length: [
            {
                _phase: 'one',
                _when: function (model) {
                    return model.get('code') == 'a';
                },
                rule: 5
            }, {
                _phase: ['two', 'three'],
                rule: 6
            }
        ]
    }
});
model = $pt.createModel({
    name: 'abc',
    code: 'a'
}, validator);

// when is true
model.validateByPhase('one', 'name');
console.log('4th Validation:');
console.log('Model has error: ' + model.hasError());
console.log(model.getError('name'));

model.validateByPhase('two', 'name');
console.log('5th Validation:');
console.log('Model has error: ' + model.hasError());
console.log(model.getError('name'));


model = $pt.createModel({}, $pt.createModelValidator({
    insuredPerson_CourtesyTitle: {
        required: {
            _when: function (model) {
                // alert(JSON.stringify(model.get('insuredCheck')));
                return model.get('insuredCheck') == true;
            },
            rule: true
        }
    }
}));
model.set('insuredCheck', true);
model.validate();
console.log(model.getError());

// regexp listener
model = $pt.createModel({
    name: 'abc',
    code: 'a'
});
var regexpListener = function(evt) {
    console.log('Monitor property[name=name, value=' + evt.new + '].');
};
model.addPostChangeListener(/name/, regexpListener);
model.set('name', 'def');
model.removePostChangeListener(/name/, regexpListener);
model.set('name', 'xyz');