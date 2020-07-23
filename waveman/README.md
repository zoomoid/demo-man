# demo-man/waveman

This is a reimplementation of the wave-man project using Flask as a webserver once more and making several adjustments
as well as compromises to increase performance while reducing configurability. For the fully-configurable wave-man, see
<https://www.github.com/occloxium/wave-man>.

Also, this wave-man makes some stronger assumptions about the default configuration of the drawing process. For once, we
always produce two waveforms (as required by the demo-man API) and require the small waveform to be strictly half the
number of blocks than the full size. Also, the default mode is the rounded-avg mode, hence, we can compute the small
waveform directly from the full one, instead of having to run the small drawing routine with different configs
completely once more. Therefore, we save some compute resources and time.
Furthermore, we no longer average over the entire data set. For a 6 minute audio track sampled at 48000 Hz which we
condense into a waveform with 50 block, we need to average a list of floats of length **225000**, which is a rather
large number. We instead use only the first 512 floats and throw away the rest of the buffer. As each of the blocks
corresponds to a 5-second audio chunk (again, 6 minutes, 48000 Hz and 50 blocks), this metric is relatively good,
considering we deal with natural audio that does not change dynamics that much (after all, I have yet to use the
demo-man for something else than Techno...).