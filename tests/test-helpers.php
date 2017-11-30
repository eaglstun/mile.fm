<?php
use PHPUnit\Framework\TestCase;

final class HelpersTest extends TestCase
{
    public function testCamelCase()
    {
        $input = 'cool_shit';
        $output = camelCase($input);

        $this->assertEquals($input, $output);
    }
}