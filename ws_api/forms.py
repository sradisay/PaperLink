from django import forms


class DiffForm(forms.Form):
    form_1 = forms.IntegerField()
    form_2 = forms.IntegerField()
